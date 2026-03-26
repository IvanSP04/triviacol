import { useState, useEffect, useCallback } from "react";
import "./App.css";

const preguntas = [
  { pregunta: "¿En qué año se firmó la independencia de Colombia?", opciones: ["1810", "1819", "1821", "1830"], respuesta: 2, categoria: "Historia", dificultad: "fácil" },
  { pregunta: "¿Quién fue el Libertador de Colombia?", opciones: ["Francisco de Paula Santander", "Simón Bolívar", "Antonio Nariño", "Rafael Núñez"], respuesta: 1, categoria: "Historia", dificultad: "fácil" },
  { pregunta: "¿En qué batalla se consolidó la independencia de Colombia?", opciones: ["Batalla de Boyacá", "Batalla de Carabobo", "Batalla del Puente de Boyacá", "Batalla de Pichincha"], respuesta: 0, categoria: "Historia", dificultad: "media" },
  { pregunta: "¿Quién fue el primer presidente de Colombia?", opciones: ["Simón Bolívar", "Francisco de Paula Santander", "Rafael Núñez", "Tomás Cipriano de Mosquera"], respuesta: 0, categoria: "Historia", dificultad: "media" },
  { pregunta: "¿En qué año se promulgó la actual Constitución colombiana?", opciones: ["1886", "1991", "1976", "2000"], respuesta: 1, categoria: "Historia", dificultad: "fácil" },
  { pregunta: "¿Cómo se llamó el movimiento que impulsó la Constitución de 1991?", opciones: ["La Séptima Papeleta", "El Frente Nacional", "La Violencia", "La Regeneración"], respuesta: 0, categoria: "Historia", dificultad: "difícil" },
  { pregunta: "¿Cuál es la capital de Colombia?", opciones: ["Medellín", "Cali", "Bogotá", "Barranquilla"], respuesta: 2, categoria: "Geografía", dificultad: "fácil" },
  { pregunta: "¿Cuántos departamentos tiene Colombia?", opciones: ["30", "32", "33", "28"], respuesta: 1, categoria: "Geografía", dificultad: "media" },
  { pregunta: "¿Cuál es el río más largo de Colombia?", opciones: ["Río Cauca", "Río Magdalena", "Río Meta", "Río Atrato"], respuesta: 1, categoria: "Geografía", dificultad: "media" },
  { pregunta: "¿Colombia tiene costas en cuántos océanos?", opciones: ["Uno", "Dos", "Tres", "Ninguno"], respuesta: 1, categoria: "Geografía", dificultad: "fácil" },
  { pregunta: "¿Cuál es el volcán activo más alto de Colombia?", opciones: ["Nevado del Ruiz", "Galeras", "Nevado del Huila", "Nevado del Tolima"], respuesta: 0, categoria: "Geografía", dificultad: "media" },
  { pregunta: "¿Cuál es el departamento más grande de Colombia?", opciones: ["Amazonas", "Vichada", "Guainía", "Meta"], respuesta: 0, categoria: "Geografía", dificultad: "difícil" },
  { pregunta: "¿De qué región es típica la bandeja paisa?", opciones: ["Costa Atlántica", "Antioquia", "Bogotá", "Valle del Cauca"], respuesta: 1, categoria: "Gastronomía", dificultad: "fácil" },
  { pregunta: "¿Cuál es el ingrediente principal del ajiaco bogotano?", opciones: ["Maíz", "Yuca", "Papa", "Fríjol"], respuesta: 2, categoria: "Gastronomía", dificultad: "fácil" },
  { pregunta: "¿Qué bebida tradicional se hace con maíz fermentado?", opciones: ["Guarapo", "Chicha", "Masato", "Champús"], respuesta: 1, categoria: "Gastronomía", dificultad: "media" },
  { pregunta: "¿De qué ciudad es típico el sancocho de guandú?", opciones: ["Bogotá", "Medellín", "Cartagena", "Manizales"], respuesta: 2, categoria: "Gastronomía", dificultad: "difícil" },
  { pregunta: "¿Cuál es el escritor colombiano ganador del Nobel de Literatura?", opciones: ["Tomás González", "Gabriel García Márquez", "Álvaro Mutis", "Jorge Isaacs"], respuesta: 1, categoria: "Cultura", dificultad: "fácil" },
  { pregunta: "¿En qué ciudad nació Gabriel García Márquez?", opciones: ["Bogotá", "Barranquilla", "Aracataca", "Santa Marta"], respuesta: 2, categoria: "Cultura", dificultad: "media" },
  { pregunta: "¿Cómo se llama el festival de música vallenata más importante?", opciones: ["Festival de Viña del Mar", "Festival Vallenato de Valledupar", "Feria de Cali", "Carnaval de Barranquilla"], respuesta: 1, categoria: "Cultura", dificultad: "media" },
  { pregunta: "¿Qué instrumento es símbolo del vallenato?", opciones: ["Guitarra", "Acordeón", "Marimba", "Gaita"], respuesta: 1, categoria: "Cultura", dificultad: "fácil" },
  { pregunta: "¿En qué ciudad se celebra el Carnaval más famoso de Colombia?", opciones: ["Cartagena", "Santa Marta", "Barranquilla", "Valledupar"], respuesta: 2, categoria: "Cultura", dificultad: "fácil" },
  { pregunta: "¿Cuál es la fruta colombiana del passiflora?", opciones: ["Lulo", "Maracuyá", "Guanábana", "Chontaduro"], respuesta: 1, categoria: "Gastronomía", dificultad: "media" },
];

const TIEMPO = 20;
const TOTAL = 10;

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [dificultad, setDificultad] = useState("todas");
  const [pregs, setPregs] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [tiempo, setTiempo] = useState(TIEMPO);
  const [respondida, setRespondida] = useState(false);
  const [historial, setHistorial] = useState([]);

  const siguiente = useCallback(() => {
    if (indice + 1 >= pregs.length) {
      setPantalla("resultado");
    } else {
      setIndice(i => i + 1);
      setSeleccionada(null);
      setRespondida(false);
      setTiempo(TIEMPO);
    }
  }, [indice, pregs.length]);

  useEffect(() => {
    if (pantalla !== "juego" || respondida) return;
    if (tiempo <= 0) {
      setRespondida(true);
      setHistorial(h => [...h, false]);
      setTimeout(siguiente, 1200);
      return;
    }
    const t = setTimeout(() => setTiempo(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [tiempo, pantalla, respondida, siguiente]);

  const iniciar = () => {
    const filtradas = dificultad === "todas" ? preguntas : preguntas.filter(p => p.dificultad === dificultad);
    setPregs(mezclar(filtradas).slice(0, TOTAL));
    setIndice(0); setPuntaje(0); setSeleccionada(null);
    setRespondida(false); setTiempo(TIEMPO); setHistorial([]);
    setPantalla("juego");
  };

  const responder = (i) => {
    if (respondida) return;
    setSeleccionada(i);
    setRespondida(true);
    const ok = pregs[indice].respuesta === i;
    if (ok) setPuntaje(p => p + 1);
    setHistorial(h => [...h, ok]);
    setTimeout(siguiente, 1400);
  };

  const actual = pregs[indice];

  return (
    <div className="app">

      {pantalla === "inicio" && (
        <div className="pantalla">
          <div className="logo-area">
            <div className="bandera-icon">🇨🇴</div>
            <h1 className="titulo">TriviaCol</h1>
            <p className="subtitulo">¿Cuánto sabes de Colombia?</p>
          </div>
          <div className="dificultad-selector">
            <p className="selector-label">Elige la dificultad</p>
            <div className="botones-dificultad">
              {["todas","fácil","media","difícil"].map(d => (
                <button key={d} className={`btn-dificultad ${dificultad === d ? "activo" : ""}`} onClick={() => setDificultad(d)}>
                  {d === "todas" ? "🎯 Todas" : d === "fácil" ? "🟢 Fácil" : d === "media" ? "🟡 Media" : "🔴 Difícil"}
                </button>
              ))}
            </div>
          </div>
          <div className="info-juego">
            <div className="info-item">📋 {TOTAL} preguntas</div>
            <div className="info-item">⏱️ {TIEMPO}s por pregunta</div>
            <div className="info-item">🗺️ Historia · Geo · Cultura</div>
          </div>
          <button className="btn-iniciar" onClick={iniciar}>¡Empezar Trivia!</button>
          <p className="creditos">Ivan Sterling &amp; Jose Niño</p>
        </div>
      )}

      {pantalla === "juego" && actual && (
        <div className="pantalla">
          <div className="juego-header">
            <div className="progreso-text">{indice + 1} / {pregs.length}</div>
            <div className={`timer ${tiempo <= 5 ? "timer-urgente" : ""}`}>⏱️ {tiempo}s</div>
            <div className="puntaje-live">⭐ {puntaje}</div>
          </div>
          <div className="barra-progreso">
            <div className="barra-fill" style={{ width: `${(indice / pregs.length) * 100}%` }} />
          </div>
          <div className="timer-barra">
            <div className={`timer-fill ${tiempo <= 5 ? "timer-fill-urgente" : ""}`} style={{ width: `${(tiempo / TIEMPO) * 100}%` }} />
          </div>
          <div className="categoria-badge">{actual.categoria} · {actual.dificultad}</div>
          <div className="pregunta-card">
            <p className="pregunta-texto">{actual.pregunta}</p>
          </div>
          <div className="opciones">
            {actual.opciones.map((op, i) => {
              let clase = "opcion";
              if (respondida) {
                if (i === actual.respuesta) clase += " correcta";
                else if (i === seleccionada) clase += " incorrecta";
                else clase += " opaca";
              }
              return (
                <button key={i} className={clase} onClick={() => responder(i)}>
                  <span className="opcion-letra">{["A","B","C","D"][i]}</span>
                  <span className="opcion-texto">{op}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pantalla === "resultado" && (
        <div className="pantalla">
          <div className="resultado-emoji">{puntaje >= 8 ? "🏆" : puntaje >= 5 ? "🎖️" : "📚"}</div>
          <h2 className="resultado-titulo">{puntaje >= 8 ? "¡Eres un experto!" : puntaje >= 5 ? "¡Bien hecho!" : "¡Sigue aprendiendo!"}</h2>
          <div className="resultado-puntaje">
            <span className="puntaje-num">{puntaje}</span>
            <span className="puntaje-total">/{pregs.length}</span>
          </div>
          <p className="resultado-porcentaje">{Math.round((puntaje / pregs.length) * 100)}% correcto</p>
          <div className="historial">
            {historial.map((r, i) => (
              <span key={i} className={`historial-dot ${r ? "dot-ok" : "dot-fail"}`}>{r ? "✓" : "✗"}</span>
            ))}
          </div>
          <div className="resultado-botones">
            <button className="btn-iniciar" onClick={iniciar}>🔄 Jugar de nuevo</button>
            <button className="btn-secundario" onClick={() => setPantalla("inicio")}>🏠 Inicio</button>
          </div>
          <p className="creditos">TriviaCol · Ivan Sterling &amp; Jose Niño</p>
        </div>
      )}
    </div>
  );
}