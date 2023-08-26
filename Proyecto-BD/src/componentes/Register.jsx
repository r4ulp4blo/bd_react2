function Registro() {
    return (
      <div
        className="bg-dark d-flex justify-content-center
          align-items-center vh-100"
      >
        <div className="containerSecudnario">
          <div className="bg-white p-5 rounded-5 text-secondary">
            <div className="text-center fs-1 fw-bold">Registrarme</div>
            <br></br>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Nombre
              </span>
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="Name"
                aria-describedby="addon-wrapping"
              ></input>
              <span className="input-group-text" id="addon-wrapping">
                Apellido
              </span>
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="LastName"
                aria-describedby="addon-wrapping"
              ></input>
            </div>
            <br></br>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Correo Electronico
              </span>
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="Email"
                aria-describedby="addon-wrapping"
              ></input>
            </div>
            <br></br>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Contraseña
              </span>
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="Password"
                aria-describedby="addon-wrapping"
              ></input>
            </div>
            <br></br>
            <div className="input-group flex-nowrap">
              <span className="input-group-text" id="addon-wrapping">
                Confirme su contraseña
              </span>
              <input
                type="text"
                className="form-control"
                placeholder=""
                aria-label="Password"
                aria-describedby="addon-wrapping"
              ></input>
            </div>
            <br></br>
            <div className="text-center">
                <a href="/val4" 
                class="link-primary">Ya tienes cuenta? Inicia Sesion</a>
            </div>
            <br></br>
            <button className="btn btn-dark text-white w-100 mt-4">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Registro;