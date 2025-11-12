import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Image, // 👈 adicionado para usar imagens
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 👇 import da imagem local
import imcImg from "./assets/balanca.png"; // certifique-se que o nome do arquivo é igual

const Stack = createStackNavigator();

// --- TELA INICIAL ---
function TelaInicial({ navigation }) {
  return (
    <View style={styles.telaInicial}>
      {/* Imagem no topo */}
      <Image source={imcImg} style={styles.imagemInicial} resizeMode="contain" />

      <Text style={styles.tituloInicial}>Bem-vindo(a)!</Text>
      <Text style={styles.subtituloInicial}>Calculadora de IMC</Text>

      <TouchableOpacity
        style={styles.botaoInicial}
        onPress={() => navigation.navigate("Calculadora")}
      >
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- CALCULADORA DE IMC ---
function CalculadoraIMC({ navigation }) {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [imc, setImc] = useState(null);
  const [classificacao, setClassificacao] = useState("");
  const [corClassificacao, setCorClassificacao] = useState("#000");
  const [erro, setErro] = useState("");

  const limpar = () => {
    setPeso("");
    setAltura("");
    setImc(null);
    setClassificacao("");
    setCorClassificacao("#000");
    setErro("");
  };

  const pegarNumero = (valor) => {
    if (!valor) return NaN;
    const convertido = valor.replace(",", ".").trim();
    return parseFloat(convertido);
  };

  const classificarIMC = (valorIMC) => {
    if (valorIMC < 18.5) return { texto: "Abaixo do Peso", cor: "#F7C948" };
    if (valorIMC >= 18.5 && valorIMC <= 24.9)
      return { texto: "Peso Normal", cor: "#2ECC71" };
    if (valorIMC >= 25 && valorIMC <= 29.9)
      return { texto: "Sobrepeso", cor: "#F1C40F" };
    if (valorIMC >= 30 && valorIMC <= 34.9)
      return { texto: "Obesidade Grau I", cor: "#E67E22" };
    if (valorIMC >= 35 && valorIMC <= 39.9)
      return { texto: "Obesidade Grau II", cor: "#E74C3C" };
    return { texto: "Obesidade Grau III", cor: "#C0392B" };
  };

  const calcular = () => {
    setErro("");
    Keyboard.dismiss();
    const p = pegarNumero(peso);
    const a = pegarNumero(altura);

    if (!peso || !altura) {
      setErro("Preencha peso e altura.");
      return;
    }
    if (isNaN(p) || isNaN(a)) {
      setErro("Valores inválidos. Use números (ex: 70 ou 70.5).");
      return;
    }
    if (a === 0) {
      setErro("Altura não pode ser zero.");
      return;
    }

    const valorIMC = p / (a * a);
    const arredondado = parseFloat(valorIMC.toFixed(2));
    const { texto, cor } = classificarIMC(arredondado);

    setImc(arredondado);
    setClassificacao(texto);
    setCorClassificacao(cor);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora de IMC</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso (kg) - ex: 70"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Altura (m) - ex: 1.75"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
      />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <View style={styles.botoesRow}>
        <TouchableOpacity style={styles.botao} onPress={calcular}>
          <Text style={styles.botaoTexto}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, styles.botaoLimpar]}
          onPress={limpar}
        >
          <Text style={styles.botaoTexto}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {imc !== null && (
        <View style={styles.resultadoBox}>
          <Text style={styles.resultadoTexto}>Seu IMC: {imc.toFixed(2)}</Text>
          <Text style={[styles.classificacaoTexto, { color: corClassificacao }]}>
            {classificacao}
          </Text>
        </View>
      )}

      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.navigate("Inicio")}
      >
        <Text style={styles.botaoVoltarTexto}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={TelaInicial} />
        <Stack.Screen name="Calculadora" component={CalculadoraIMC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  // Tela inicial
  telaInicial: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  imagemInicial: {
    width: 50,
    height: 50,
    marginBottom: 30,
  },
  tituloInicial: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
    color: "#3498DB",
    textAlign: "center",
  },
  subtituloInicial: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  botaoInicial: {
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },

  // Calculadora
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
    color: "#666",
  },
  botoesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 18,
    width: "100%",
  },
  botao: {
    flex: 1,
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  botaoLimpar: {
    backgroundColor: "#95A5A6",
  },
  botaoTexto: {
    color: "#FFF",
    fontWeight: "600",
  },
  resultadoBox: {
    marginTop: 18,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FAFAFA",
    width: "100%",
    alignItems: "center",
  },
  resultadoTexto: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  classificacaoTexto: {
    fontSize: 18,
    fontWeight: "700",
  },
  erro: {
    color: "#C0392B",
    marginBottom: 8,
  },
  botaoVoltar: {
    marginTop: 25,
    backgroundColor: "#6C757D",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  botaoVoltarTexto: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
