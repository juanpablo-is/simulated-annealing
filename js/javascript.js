/*
    Proyecto desarrollado por Juan Pablo Barrera  - https://github.com/juanpablo-is/
*/

var boton = document.getElementById("btnContinuar");
let variables;
let restricciones;

var valoresFuncionObjetivo = [];
var valoresIgualdadRestriccion = [];
var valorRestricciones = [];
var sActual = [];
var valoresIteraciones = [];
let signo = [];
var temperatura;
var lineGraph;

boton.addEventListener('click', function (e) {
    let textoBoton = e.target.innerHTML;
    if (textoBoton === "CONTINUAR") {
        temperatura = parseFloat(document.getElementById("temperatura").value);
        valoresIteraciones.push(parseFloat(document.getElementById("iteracionDiferente").value));
        valoresIteraciones.push(parseFloat(document.getElementById("iteracionIgual").value));

        continuar();
    } else if (textoBoton === "PROCESAR") {
        if (validar()) {
            procesar();
        } else {
            alert("Debe llenar los campos requeridos");
        }
    }
}, true);


function continuar() {
    boton.innerHTML = "PROCESAR";
    variables = document.getElementById("cantidadVariables").value;
    restricciones = document.getElementById("cantidadRestricciones").value;
    var divPrincipal = document.getElementById("camposInicio");
    divPrincipal.innerHTML = ""
    divPrincipal.classList.remove("camposInicio");

    let divFO = document.createElement("div");
    divFO.classList.add("inputValores");

    let h1 = document.createElement("h1");
    h1.innerHTML = "Función Objetivo";
    divFO.appendChild(h1);

    let divInputsFO = document.createElement("div");
    divInputsFO.classList.add("campoIzquierdaJS");
    divInputsFO.classList.add("inputValores");
    divInputsFO.style.gridTemplateColumns = "repeat(" + (variables * 2 - 1) + ",1fr)";

    for (let i = 0; i < variables; i++) {
        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("min", '0');
        input.setAttribute("class", 'funcionObjetivo');
        input.setAttribute("placeholder", "X" + (i + 1));
        divInputsFO.appendChild(input);

        if (i < variables - 1) {
            let h4 = document.createElement("h4");
            h4.innerHTML = "+";
            divInputsFO.appendChild(h4);
        }
    }

    divFO.appendChild(divInputsFO);

    divPrincipal.appendChild(divFO);
    divPrincipal.appendChild(document.createElement("hr"));

    for (let i = 0; i < restricciones; i++) {
        let div = document.createElement("div");
        div.classList.add("inputValores");

        let label = document.createElement("label");
        label.setAttribute("for", "restriccion_" + (i + 1));
        label.innerText = "Restricción #" + (i + 1);
        div.appendChild(label);

        let divInputs = document.createElement("div");
        divInputs.classList.add("camposJS");

        let divIzquierda = document.createElement("div");
        divIzquierda.classList.add("campoIzquierdaJS");
        divIzquierda.style.gridTemplateColumns = "repeat(" + (variables * 2 - 1) + ",1fr)";

        for (let i = 0; i < variables; i++) {
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("min", '0');
            input.setAttribute("class", 'valoresRestriccion');
            input.setAttribute("placeholder", "X" + (i + 1));
            divIzquierda.appendChild(input);

            if (i < variables - 1) {
                let h4 = document.createElement("h4");
                h4.innerHTML = "+";
                divIzquierda.appendChild(h4);
            }
        }
        divInputs.appendChild(divIzquierda);

        let divDerecha = document.createElement("div");
        divDerecha.classList.add("campoDerechaJS");

        let selector = document.createElement("select");
        selector.setAttribute("id", "select" + i);

        let valores = [">=", "<="];
        for (let i = 0; i < valores.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", valores[i]);
            option.innerHTML = valores[i];
            selector.appendChild(option);
        }
        divDerecha.appendChild(selector);

        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("min", '1');
        input.setAttribute("class", 'valorRestriccion');
        input.style.width = "50%";
        divDerecha.appendChild(input);

        divInputs.appendChild(divDerecha);

        div.appendChild(divInputs);
        divPrincipal.appendChild(div);
    }

    divPrincipal.appendChild(document.createElement("hr"));
    let divActual = document.createElement("div");
    divActual.classList.add("inputValores");

    let labelActual = document.createElement("label");
    labelActual.innerHTML = "Primer valor para los X - s.Actual";
    divActual.appendChild(labelActual);

    let divInputsActual = document.createElement("div");
    divInputsActual.classList.add("campoIzquierdaJS");
    divInputsActual.classList.add("inputValores");
    divInputsActual.style.gridTemplateColumns = "repeat(" + (variables * 2 - 1) + ",1fr)";

    for (let i = 0; i < variables; i++) {
        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("min", '0');
        input.setAttribute("class", 'valoresActual');
        input.setAttribute("placeholder", "X" + (i + 1));
        divInputsActual.appendChild(input);

        if (i < variables - 1) {
            let h4 = document.createElement("h4");
            h4.innerHTML = " - ";
            divInputsActual.appendChild(h4);
        }
    }

    divActual.appendChild(divInputsActual);
    divPrincipal.appendChild(divActual);
}

function validar() {
    var funcionObjetivo = document.getElementsByClassName("funcionObjetivo");
    var valorRestriccion = document.getElementsByClassName("valorRestriccion");

    for (let i = 0; i < funcionObjetivo.length; i++) {
        let valor = funcionObjetivo[i].value;
        if (valor === "") {
            return false;
        }
        valoresFuncionObjetivo.push(parseFloat(valor));
    }

    for (let i = 0; i < valorRestriccion.length; i++) {
        let valor = valorRestriccion[i].value;
        if (valor === "") {
            return false;
        }
        valoresIgualdadRestriccion.push(parseFloat(valor));
    }

    for (let i = 0; i < variables; i++) {
        let actual = document.getElementsByClassName("valoresActual")[i].value;
        if (actual === "") {
            return false;
        }
    }

    return true;
}

function procesar() {
    var restriccion = document.getElementsByClassName("valoresRestriccion");

    let con = 0;

    for (let i = 0; i < restricciones; i++) {
        let signoF = document.getElementById("select" + i);
        signo.push(signoF.options[signoF.selectedIndex].value);
        let valorRow = [];
        for (let j = 0; j < variables; j++) {
            valorRow.push((restriccion[con].value === "") ? 0 : parseFloat(restriccion[con++].value));
        }
        valorRestricciones.push(valorRow);
    }

    for (let i = 0; i < variables; i++) {
        sActual.push(parseFloat(document.getElementsByClassName("valoresActual")[i].value));
    }

    procesoEnvio();
}


function procesoEnvio() {
    let sNuevo = [];

    lineGraph = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Valores',
                data: [],
                fill: false,
                borderColor: 'white'
            }]
        }
    };

    for (let i = 0; i < valoresIteraciones[0]; i++) {
        for (let j = 0; j < valoresIteraciones[1]; j++) {
            sNuevo = JSON.parse(JSON.stringify(sActual));
            let k = Math.floor(Math.random() * variables);

            let respuesta = media(0, 0.1);
            sNuevo[k] = sActual[k] + respuesta;
            if (sNuevo[k] < 0) {
                sNuevo[k] = 0;
            }

            let funcion1 = funcion(sNuevo);
            let funcion2 = funcion(sActual);
            let delta = funcion1 - funcion2;

            if (delta > 0) {
                sActual = JSON.parse(JSON.stringify(sNuevo));
            } else {
                // let aleatorio = Math.floor(Math.random() * 2);
                let aleatorio = Math.random();
                // let exponencial = Math.exp(delta / temperatura);
                let exponencial = Math.pow(Math.E, (delta / temperatura));
                if (aleatorio < exponencial) {
                    sActual = JSON.parse(JSON.stringify(sNuevo));
                }
            }
        }

        temperatura *= 0.95;
        let valorGrafica = funcion(sActual);
        lineGraph.data.labels.push("");
        lineGraph.data.datasets[0].data.push(valorGrafica);
    }
    resultado();
}

function funcion(x) {

    let valorZ = 0;
    for (let i = 0; i < restricciones; i++) {
        let resultado = 0;
        for (let j = 0; j < variables; j++) {
            resultado += valorRestricciones[i][j] * x[j];
        }

        let signoProceso = signo[i];

        if (signoProceso === "<=") {
            if (resultado > valoresIgualdadRestriccion[i]) {
                valorZ -= 10;
            }
        } else if (signoProceso === ">=") {
            if (resultado > valoresIgualdadRestriccion[i]) {
                valorZ += 10;
            }
        }
    }

    if (valorZ === 0) {
        for (let i = 0; i < variables; i++) {
            valorZ += valoresFuncionObjetivo[i] * x[i];
        }
    }

    return valorZ;
}

function media(media, dest) {
    let z = Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
    let resultado = media + dest * z;
    return resultado;
}

function resultado() {
    cargarHTML();

    var funcionValor = funcion(sActual);
    var JSONGrafica = JSON.stringify(lineGraph);

    document.getElementById("valorFuncionObjetivo").value = funcionValor;

    let divInputsActual = document.createElement("div");
    divInputsActual.classList.add("campoIzquierdaJS");
    divInputsActual.classList.add("inputValores");
    divInputsActual.style.gridTemplateColumns = "repeat(" + (sActual.length * 2 - 1) + ",1fr)";

    for (let i = 0; i < sActual.length; i++) {
        let input = document.createElement("input");
        input.setAttribute("type", "number");
        input.setAttribute("disabled", "true");
        input.setAttribute("value", sActual[i]);
        input.style.maxWidth = "150px";
        divInputsActual.appendChild(input);

        if (i < sActual.length - 1) {
            let h4 = document.createElement("h4");
            h4.innerHTML = " - ";
            divInputsActual.appendChild(h4);
        }
    }

    document.getElementById("valores").appendChild(divInputsActual);

    var h5 = document.createElement("h2");
    h5.innerHTML = "Gráfica"
    document.getElementById("principal").appendChild(h5);

    var imagen = document.createElement("canvas");
    imagen.setAttribute("src", "https://quickchart.io/chart?c=" + JSONGrafica);
    imagen.style.width = "100%";
    imagen.style.padding = "20px";

    var mychart = new Chart(imagen, lineGraph);

    document.getElementById("principal").appendChild(imagen);

}

function cargarHTML() {
    let divPrincipal = document.getElementById("principal");
    divPrincipal.innerHTML = "";
    let h1G = document.createElement("h1");
    h1G.innerHTML = "Resultados Recocido Simulado";
    divPrincipal.appendChild(h1G);
    divPrincipal.appendChild(document.createElement("hr"));

    let divValores = document.createElement("div");
    divValores.classList.add("inputValores");
    divValores.id = "valores";

    let label = document.createElement("label");
    label.innerHTML = "Resultado de los valores";
    divValores.appendChild(label);
    divPrincipal.appendChild(divValores);

    let divCampos = document.createElement("div");
    divCampos.classList.add("camposInicio");
    divCampos.classList.add("campoFuncion");

    let divInputs = document.createElement("div");
    divInputs.classList.add("inputInicio");

    let label1 = document.createElement("label");
    label1.for = "valorFuncionObjetivo";
    label1.innerHTML = "Resultado Función Objetivo";
    divInputs.appendChild(label1);

    let input1 = document.createElement("input");
    input1.id = "valorFuncionObjetivo";
    input1.setAttribute("disabled", "true");
    input1.setAttribute("type", "number");
    divInputs.appendChild(input1);
    divCampos.appendChild(divInputs);
    divPrincipal.appendChild(divCampos);
}


/*
    Proyecto desarrollado por Juan Pablo Barrera  - https://github.com/juanpablo-is/
*/