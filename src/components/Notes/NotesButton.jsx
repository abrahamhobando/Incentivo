import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Tooltip,
  Slide,
  Paper,
  IconButton,
  Typography,
  TextField,
  useTheme,
  alpha,
  Grid,
  Fade,
  Collapse,
} from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DoneIcon from '@mui/icons-material/Done';
import { ColorModeContext } from '../../main';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotes, addNote, deleteNote, updateNote } from '../../utils/storage';

const NotesButton = () => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [hoveredNoteId, setHoveredNoteId] = useState(null);
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  const textFieldRef = useRef(null);

  // Cargar las notas cuando se abre el panel
  const togglePanel = () => {
    const newState = !panelOpen;
    setPanelOpen(newState);
    
    // Si cerramos el panel, salimos también del modo edición
    if (!newState && editMode) {
      setEditMode(false);
    }
    
    // Si abrimos el panel, cargamos las notas
    if (newState) {
      loadNotes();
    }
  };

  const loadNotes = () => {
    const savedNotes = getNotes();
    // Sort by updatedAt, most recent first
    savedNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setNotes(savedNotes);
  };

  // Crear una nueva nota directamente en el panel
  const handleCreateNote = () => {
    // Limpiar el contenido y entrar en modo edición
    setContent('');
    setEditingNoteId(null);
    setEditMode(true);
    setLastSaved(null);
    
    // Enfocar el campo de texto después de que aparezca
    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
      }
    }, 300);
  };

  // Editar una nota existente
  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      setContent(noteToEdit.content);
      setEditingNoteId(noteId);
      setEditMode(true);
      setLastSaved(null);
      
      // Enfocar el campo de texto después de que aparezca
      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus();
        }
      }, 300);
    }
  };

  // Eliminar una nota
  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
    loadNotes();
  };

  // Actualizar la nota actual con un nuevo contenido
  const handleNoteUpdated = (updatedNote) => {
    if (!updatedNote) return;
    
    // Actualizar la lista de notas sin tener que recargarlas todas
    setNotes(prevNotes => {
      const index = prevNotes.findIndex(note => note.id === updatedNote.id);
      if (index !== -1) {
        // Si ya existe la nota, actualizarla en su posición y moverla al inicio
        const newNotes = [...prevNotes];
        newNotes.splice(index, 1); // Quitar de su posición actual
        return [updatedNote, ...newNotes]; // Agregar al inicio
      } else {
        // Si es una nota nueva, agregarla al inicio
        return [updatedNote, ...prevNotes];
      }
    });
  };

  // Guardar la nota automáticamente
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for autosave (1 second after last input)
    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave(newContent);
    }, 800);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Handle autosave
  const handleAutoSave = (contentToSave) => {
    if (!contentToSave.trim()) return;
    
    let savedNote;
    
    if (editingNoteId) {
      // Update existing note
      savedNote = updateNote(editingNoteId, contentToSave);
    } else {
      // Create new note and update the local state with the result
      savedNote = addNote(contentToSave);
      setEditingNoteId(savedNote.id);
    }
    
    // Update last saved timestamp
    setLastSaved(new Date());
    
    // Update notes list
    handleNoteUpdated(savedNote);
  };

  // Guardar y salir del modo edición
  const handleSaveAndExit = () => {
    // Guardar la nota actual si hay contenido
    if (content.trim()) {
      let savedNote;
      if (editingNoteId) {
        savedNote = updateNote(editingNoteId, content);
      } else {
        savedNote = addNote(content);
      }
      handleNoteUpdated(savedNote);
    }
    
    // Limpiar el estado y salir del modo edición
    setEditMode(false);
    setContent('');
    setEditingNoteId(null);
    setLastSaved(null);
  };

  // Formato de fecha para mostrar en las notas
  const formatDate = (dateString) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Formato para el último guardado automático
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    };
    return lastSaved.toLocaleTimeString('es-ES', options);
  };

  return (
    <>
      {/* Botón flotante */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1200,
        }}
      >
        <Tooltip 
          title={panelOpen ? "Ocultar notas" : "Mis notas"}
          placement="left"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: mode === 'dark' 
                  ? 'rgba(0,0,0,0.8)' 
                  : 'rgba(97, 97, 97, 0.92)',
                '& .MuiTooltip-arrow': {
                  color: mode === 'dark' 
                    ? 'rgba(0,0,0,0.8)' 
                    : 'rgba(97, 97, 97, 0.92)',
                },
                px: 1.5,
                py: 0.5,
                fontSize: '0.7rem',
              }
            }
          }}
        >
          <Fab
            size="medium"
            color={panelOpen ? "secondary" : "primary"}
            aria-label="Notas"
            onClick={togglePanel}
            sx={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              color: '#fff',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
              },
            }}
          >
            <NotesIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Panel lateral flotante */}
      <Slide 
        direction="left" 
        in={panelOpen} 
        mountOnEnter 
        unmountOnExit
        timeout={230}
      >
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            right: 20,
            top: 80,
            bottom: 80,
            width: 320,
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column',
            background: mode === 'dark' 
              ? alpha(theme.palette.background.paper, 0.85)
              : alpha(theme.palette.background.paper, 0.85),
            backdropFilter: 'blur(8px)',
            border: '1px solid',
            borderColor: mode === 'dark' 
              ? alpha(theme.palette.divider, 0.1)
              : alpha(theme.palette.divider, 0.15),
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Cabecera del panel */}
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1)
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center'
            }}>
              {editMode ? (
                <>
                  <IconButton 
                    size="small"
                    onClick={handleSaveAndExit}
                    sx={{ mr: 1, p: 0.5 }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                  {editingNoteId ? 'Editar Nota' : 'Nueva Nota'}
                </>
              ) : (
                'Mis Notas'
              )}
            </Typography>
            <Box>
              {!editMode && (
                <Tooltip title="Nueva nota" arrow>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={handleCreateNote}
                    sx={{ mr: 1 }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {editMode && (
                <Tooltip title="Guardar" arrow>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={handleSaveAndExit}
                    sx={{ mr: 1 }}
                    disabled={!content.trim()}
                  >
                    <DoneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Cerrar" arrow>
                <IconButton 
                  size="small" 
                  onClick={() => {
                    if (editMode) {
                      handleSaveAndExit();
                    }
                    setPanelOpen(false);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Contenido del panel */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            '::-webkit-scrollbar': {
              width: '6px',
            },
            '::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '3px',
            },
            '::-webkit-scrollbar-thumb:hover': {
              background: alpha(theme.palette.primary.main, 0.4),
            },
          }}>
            {/* Modo edición */}
            <Fade in={editMode}>
              <Box sx={{ 
                display: editMode ? 'block' : 'none',
                mb: 2
              }}>
                <TextField
                  inputRef={textFieldRef}
                  fullWidth
                  multiline
                  rows={10}
                  placeholder="Escribe tu nota aquí..."
                  value={content}
                  onChange={handleContentChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.15)
                        : alpha(theme.palette.background.paper, 0.5),
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      },
                      transition: 'all 0.2s ease',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                  }}
                />
                {lastSaved && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1,
                      display: 'block',
                      textAlign: 'right',
                      fontStyle: 'italic', 
                      fontSize: '0.7rem' 
                    }}
                  >
                    Guardado automático: {formatLastSaved()}
                  </Typography>
                )}
              </Box>
            </Fade>

            {/* Modo visualización */}
            <Fade in={!editMode}>
              <Box sx={{ 
                display: !editMode ? 'block' : 'none' 
              }}>
                <AnimatePresence>
                  {notes.length === 0 ? (
                    <Box sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexDirection: 'column',
                      opacity: 0.7,
                      py: 4
                    }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        No hay notas
                      </Typography>
                      <Tooltip title="Crear nota" arrow>
                        <IconButton 
                          color="primary" 
                          onClick={handleCreateNote}
                          sx={{ 
                            mt: 1,
                            border: '1px dashed',
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            p: 1.5
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {notes.map((note) => (
                        <Grid item xs={12} key={note.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            layout
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 1,
                                bgcolor: alpha(note.color, 0.85),
                                backdropFilter: 'blur(4px)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease',
                                boxShadow: hoveredNoteId === note.id 
                                  ? '0 4px 12px rgba(0,0,0,0.1)' 
                                  : '0 2px 8px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                }
                              }}
                              onClick={() => handleEditNote(note.id)}
                              onMouseEnter={() => setHoveredNoteId(note.id)}
                              onMouseLeave={() => setHoveredNoteId(null)}
                            >
                              <Typography 
                                variant="body2"
                                sx={{
                                  color: 'rgba(0,0,0,0.87)',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  mb: 1.5,
                                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                                }}
                              >
                                {note.content}
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: `1px solid ${alpha('#000000', 0.08)}`,
                                pt: 1,
                              }}>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: alpha('#000000', 0.6), 
                                    fontWeight: 500,
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  {formatDate(note.updatedAt)}
                                </Typography>
                                
                                <Box sx={{ 
                                  opacity: hoveredNoteId === note.id ? 1 : 0,
                                  transition: 'opacity 0.2s ease',
                                }}>
                                  <Tooltip title="Eliminar" arrow>
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                      }}
                                      sx={{
                                        p: 0.5,
                                        color: alpha('#000000', 0.7),
                                        backgroundColor: alpha('#ffffff', 0.4),
                                        '&:hover': {
                                          backgroundColor: alpha('#ffffff', 0.7),
                                          color: theme.palette.error.main
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Paper>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </AnimatePresence>
              </Box>
            </Fade>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default NotesButton; 