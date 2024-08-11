import "/src/assets/css/style.css";

export default function Footer() {
    return (
        // style={{magin:"0", padding:"0"}}
        <footer className="footer custom "
            style={{background:"#d66d75", 
            background: "-webkit-linear-gradient(to right, #d66d75, #e29587)",
            background: "linear-gradient(to right, #d66d75, #e29587)"}}  >
            <div className="content has-text-centered" >
                <p>
                    Tus recetas by{" "}
                    <a href="https://gmail.com">tusRecetas@gmail.com</a>.
                </p>
            </div>
        </footer>
    );
}
