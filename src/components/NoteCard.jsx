function NoteCard({
  note,
  onDelete,
  onEdit,
  onComplete
}) {

  return (

    <div
      className="card  p-4 shadow-sm mb-4 borderRadius-20"
      style={{
        
        backgroundColor: note.note_color || "#ffffff",
        fontFamily: note.font_family || "Inter"
        
      }}
    >

      {note.image_url && (

  <img
    src={`http://localhost/Syanotes/backend/${note.image_url}`}
    className="card-img-top"
    alt="Nota"
    style={{
      maxHeight:"250px",
      objectFit:"cover"
    }}
  />

)}

     

      <div className="card-body p-4">

        <h4 className="fw-bold mb-2">
          {note.title}
        </h4>

        <hr className="opacity-25" />

        <p
          style={{
            whiteSpace: "pre-line"
          }}
        >
          {note.content}
        </p>

        <p className="mb-3">

          <strong>Estado:</strong>{" "}

          {
            note.completed == 1
              ? (
                <span className="badge bg-success">
                  Completada
                </span>
              )
              : (
                <span className="badge bg-warning text-dark">
                  Pendiente
                </span>
              )
          }

        </p>

        <div className="d-flex gap-2 flex-wrap">

          {
            note.completed != 1 && (
              <button
                className="btn btn-success btn-sm"
                onClick={() => onComplete(note.id)}
              >
                Completar
              </button>
            )
          }

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onEdit(note)}
          >
            Editar
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(note.id)}
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>

  );

}

export default NoteCard;