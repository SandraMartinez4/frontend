import { useState, useEffect, useCallback } from "react";
import axios from "../services/api";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

function Notes() {
  const [color, setColor] = useState("#ffffff");
  const [imageFile, setImageFile] = useState(null);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  // Cargar notas
  const loadNotes = useCallback(async () => {
    try {
      const response = await axios.get(`/get_notes.php?user_id=${user.id}`);
      setNotes(response.data);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  }, [user.id]);

  // Crear nota
  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Título y contenido obligatorios");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("note_color", color);
      formData.append("font_family", fontFamily);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("/create_note.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setColor("#ffffff");
      setImageFile(null);

      loadNotes();
    } catch (error) {
      console.error("Error creando nota:", error);
    }
  };

  // Preparar edición
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.note_color || "#ffffff");
    setFontFamily(note.font_family || "Inter");
    setEditingId(note.id);
  };

  // Actualizar nota
  const updateNote = async () => {
    try {
      await axios.post("/update_note.php", {
        id: editingId,
        title,
        content,
        note_color: color,
        font_family: fontFamily,
      });

      setEditingId(null);
      setTitle("");
      setContent("");
      setColor("#ffffff");
      setFontFamily("Inter");

      loadNotes();
    } catch (error) {
      console.error("Error actualizando nota:", error);
    }
  };

  // Eliminar nota
  const deleteNote = async (id) => {
    const confirmDelete = window.confirm("¿Deseas eliminar esta nota?");
    if (!confirmDelete) return;

    try {
      await axios.post("/delete_note.php", { id });
      loadNotes();
    } catch (error) {
      console.error("Error eliminando nota:", error);
    }
  };

  // Completar nota
  const completeNote = async (noteId) => {
    try {
      const response = await axios.post("/complete_note.php", {
        note_id: noteId,
        user_id: user.id,
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `¡Ganaste ${response.data.points_added} puntos!`,
        });

        setTimeout(() => setMessage(null), 3000);

        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            points:
              response.data.points !== undefined
                ? response.data.points
                : currentUser.points,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        loadNotes();
      } else {
        alert("No se pudieron sumar los puntos");
      }
    } catch (error) {
      console.error("Error completando nota:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Mis Notas</h1>

        <div className="card p-3 mb-4">
          <input
            className="form-control mb-3"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {user.is_premium === 1 ? (
            <>
              <input
                type="color"
                className="form-control mb-3"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />

              <select
                className="form-select mb-3"
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
              </select>

              <input
                type="file"
                className="form-control mb-3"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </>
          ) : (
            <>
              <div className="alert alert-warning">
                El color y tipografías son funciones Premium
              </div>
            </>
          )}

          <button
            className={editingId ? "btn btn-warning" : "btn btn-success"}
            onClick={editingId ? updateNote : createNote}
          >
            {editingId ? "Actualizar Nota" : "Crear Nota"}
          </button>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <h3>Lista de Notas</h3>

        {notes.length === 0 ? (
          <div className="alert alert-info">No tienes notas registradas.</div>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onEdit={editNote}
              onComplete={completeNote}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Notes;
