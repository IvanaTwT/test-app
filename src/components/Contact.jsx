import Navbar from "./Navbar";

export default function Contact() {
    return (
        <div className="box">
            <h1 className="title is-2">Contacto</h1>
            <p className="is-size-5">
                Si tienes alguna pregunta, sugerencia o comentario puedes
                encontrarnos en nuestras redes sociales:
            </p>
            <div className="social-media">
                <a
                    href="https://facebook.com"
                    target="_blank"
                    className="button is-light is-large"
                >
                    <i className="fab fa-facebook" aria-hidden="true"></i>
                </a>
                <a
                    href="https://instagram.com"
                    target="_blank"
                    className="button is-light is-large"
                >
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    className="button is-light is-large"
                >
                    <i className="fab fa-twitter" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    );
}
