import "./styles.css"
function BarraSearch() {
    return (
        <div className="search-container">
            <div >
                <img className="background-image" src="src/components/fondo.jpg" alt=""/>
            </div>
            
            <div className="">
                <div className="box search-box" style={{width:"500px"}}>
                  <h2 className="title">¿Qué te gustaría cocinar?</h2>
                  <form className="">
                      <div className="is-flex is-align-items-center is-justify-content-center field has-addons">
                      <div className="control is-expanded">{/* is-expanded */}
                        <input className="button input  input-image"  type="text" placeholder="Buscar..." />
                      </div>
                      <div className="control ">
                        <button className="button is-dark is-medium"> {/* is-rounded */}
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
            </div>
        </div>
    );
}
export default BarraSearch;
