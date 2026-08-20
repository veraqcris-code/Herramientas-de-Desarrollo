function Formulario() {
  return (
    <form>
      <h2>Formulario de contacto</h2>

      <label htmlFor="nombre">Nombre</label>
      <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre" />

      <label htmlFor="correo">Correo</label>
      <input type="email" id="correo" name="correo" placeholder="correo@ejemplo.com" />

      <label htmlFor="mensaje">Mensaje</label>
      <textarea id="mensaje" name="mensaje" placeholder="Escribe tu mensaje" />

      <button type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;
