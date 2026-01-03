import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import NumberKeyboard from '../_components/NumberKeyboard';
import InputBox from '../_components/InputBox';
import PredButton from '../_components/PredButton';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ContraRelojScreen() {
  const router = useRouter();
  const [factor1, setFactor1] = useState(getRandomInt(2, 12));
  const [factor2, setFactor2] = useState(getRandomInt(2, 12));
  const [userAnswer, setUserAnswer] = useState('');
  const [multiplicationsCompleted, setMultiplicationsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secAdd = 10; // Segundos a añadir por respuesta correcta
  const secStart = 30; // Segundos iniciales

  // Iniciar juego
  const startGame = () => {
    setGameStarted(true);
    setGameFinished(false);
    setMultiplicationsCompleted(0);
    setTimeLeft(secStart);
    setTotalTimeSpent(0);
    setUserAnswer('');
    setShowError(false);
    setShowSuccess(false);
    generateNewMultiplication();
  };

  // Generar nueva multiplicación
  const generateNewMultiplication = () => {
    setFactor1(getRandomInt(2, 12));
    setFactor2(getRandomInt(2, 12));
    setUserAnswer('');
    setShowError(false);
    setShowSuccess(false);
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setTotalTimeSpent(t => t + 1);
          
          if (newTime <= 0) {
            setGameFinished(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameFinished, timeLeft]);

  // Manejar entrada de números
  const handleNumberPress = (number: string) => {
    if (!gameStarted || gameFinished) return;
    if (userAnswer.length < 4) { // Limitar a 4 dígitos
      setUserAnswer(prev => prev + number);
      setShowError(false);
    }
  };

  // Manejar borrado
  const handleDelete = () => {
    if (!gameStarted || gameFinished) return;
    setUserAnswer(prev => prev.slice(0, -1));
    setShowError(false);
  };

  // Manejar verificación de respuesta
  const handleAccept = () => {
    if (!gameStarted || gameFinished || userAnswer === '') return;
    
    const correctAnswer = factor1 * factor2;
    const userAnswerNum = parseInt(userAnswer);
    
    if (userAnswerNum === correctAnswer) {
      // Respuesta correcta
      setShowSuccess(true);
      setMultiplicationsCompleted(prev => prev + 1);
      setTimeLeft(prev => prev + secAdd); 
      
      // Generar nueva multiplicación después de un breve delay
      setTimeout(() => {
        generateNewMultiplication();
      }, 300);
    } else {
      // Respuesta incorrecta
      setShowError(true);
      setTimeout(() => {
        setUserAnswer('');
        setShowError(false);
      }, 1000);
    }
  };

  // Pantalla inicial
  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.welcomeTitle}>Contrarreloj</Text>
          <Text style={styles.welcomeText}>
            • Tienes {timeLeft} segundos iniciales{'\n'}
            • Cada multiplicación correcta suma {secAdd} segundos{'\n'}
            • ¡Resuelve todas las que puedas!
          </Text>
          <PredButton 
            onPress={startGame} 
            title="Comenzar" 
            iconName="play-outline" 
            size="large" 
          />
          <PredButton 
            onPress={() => router.back()} 
            title="Volver a Inicio" 
            iconName="arrow-back-outline" 
            size="small" 
          />
        </View>
      </View>
    );
  }

  // Pantalla de resultados finales
  if (gameFinished) {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.resultTitle}>¡Tiempo Terminado!</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statLabel}>Multiplicaciones completadas:</Text>
            <Text style={styles.statValue}>{multiplicationsCompleted}</Text>
            
            <Text style={styles.statLabel}>Tiempo total gastado:</Text>
            <Text style={styles.statValue}>{totalTimeSpent} segundos</Text>
          </View>
          <PredButton 
            onPress={startGame} 
            title="Jugar de Nuevo" 
            iconName="refresh-outline" 
            size="large" 
          />
          <PredButton 
            onPress={() => router.back()} 
            title="Volver a Inicio" 
            iconName="home-outline" 
            size="small" 
          />
        </View>
      </View>
    );
  }

  // Pantalla de juego
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View style={styles.gameHeader}>
          <Text style={[styles.timer, timeLeft <= 10 && styles.timerCritical]}>
            ⏰ {timeLeft}s
          </Text>
          <Text style={styles.score}>
            Completadas: {multiplicationsCompleted}
          </Text>
        </View>
      </View>

      <View style={styles.operationView}>
        <View style={styles.operationCenter}>
          <View style={styles.operationContainer}>
            {/* Mostrar la multiplicación */}
            <View style={styles.row}>
              <Text style={styles.multiplicationText}>{factor1} × {factor2} = </Text>
              <InputBox
                value={userAnswer}
                placeholder=""
                fontSize={28}
                editable={true}
                borderColor={showError ? "#FF0000" : showSuccess ? "#4CAF50" : "#89E7FF"}
                backgroundColor={showError ? "#FFE6E6" : showSuccess ? "#E8F5E8" : "#fff"}
                size={80}
                onPress={() => {}} // No necesario para este caso
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.keyboardContainer}>
        <NumberKeyboard
          onNumberPress={handleNumberPress}
          onAccept={handleAccept}
          onDelete={handleDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#89E7FF",
  },
  title: {
    flex: 0.8,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Platform.OS === "web" ? "2%" : "5%",
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  timerCritical: {
    color: '#FF0000',
    textShadowColor: '#FF0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  score: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  operationView: {
    flex: 6,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#89E7FF",
    width: "100%",
    paddingHorizontal: 20,
  },
  operationContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 50,
  },
  operationCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  multiplicationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 15,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: Platform.OS === "web" ? "flex-end" : "center",
    width: Platform.OS === "web" ? "10%" : "100%",
    minWidth: Platform.OS === "web" ? 300 : "100%",
    height: Platform.OS === "web" ? "15%" : "100%",
    paddingBottom: Platform.OS === "web" ? "1%" : "5%",
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
  },
});