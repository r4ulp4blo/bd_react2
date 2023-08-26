function ImagenComponent(props) {
  const { filename } = props;

  // Construye la URL completa para la imagen
  const imageUrl = `http://localhost:3000/images/${filename}`;

  //este componente unicamente recibe la imagen y le da un formato para no deformar la tabla
  return (
    <div>
      <img
        style={{ width: "80px", height: "90px" }}
        src={imageUrl}
        alt="Imagen del libro"
      />
    </div>
  );
}

export default ImagenComponent;
