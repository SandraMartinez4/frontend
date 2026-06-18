// Fragmento de ejemplo para tu vista CreateNote.jsx o donde manejes la imagen
import { useState } from "react";

function CreateNote() {

  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null); // Aquí guardamos el archivo binario

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Captura el archivo seleccionado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // IMPORTANTE: Al subir archivos no se manda un JSON plano, se usa FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile); // Adjuntamos el archivo real
    }

    try {
      const response = await fetch("http://localhost/backend/create_note.php", {
        method: "POST",
        body: formData, // Enviamos el formData directamente
        // NO agregues 'Content-Type': 'application/json', el navegador se encarga del multipart/form-data
      });
      const data = await response.json();
      if (data.success) {
        alert("Nota guardada con éxito");
      }
    } catch (error) {
      console.error("Error al subir la nota:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-4 shadow-sm">
      {/* ... inputs de título y contenido ... */}
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Imagen de la nota (Premium)</label>
        <input 
          type="file" 
          className="form-control rounded-3" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </div>
      
      <button type="submit" className="btn btn-primary rounded-pill">Guardar Nota</button>
    </form>
  );
}