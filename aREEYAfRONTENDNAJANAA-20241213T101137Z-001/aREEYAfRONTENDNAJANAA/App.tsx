import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

const Areeya: React.FC = () => {
  // Animation values for Case 1
  const animatedTopCase1 = useRef(new Animated.Value(50)).current; // Initial top position
  const animatedRightCase1 = useRef(new Animated.Value(20)).current; // Initial right position

  // Animation values for Case 2
  const animatedTopCase2 = useRef(new Animated.Value(50)).current; // Initial top position
  const animatedRightCase2 = useRef(new Animated.Value(20)).current; // Initial right position
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const [acceleration, setAcceleration] = useState(0);
  // State to toggle between images (image2 and image3)
  // State to toggle between cases
  // State for coughing label visibility (Case 4)
  const [isCoughing, setIsCoughing] = useState(false);
  const animatedGaitSpeed = useRef(new Animated.Value(0)).current; // Initial speed
  const animatedTopCase5 = useRef(new Animated.Value(50)).current; // Initial top position for Case 5
  const animatedRightCase5 = useRef(new Animated.Value(20)).current; // Initial right position for Case 5
  const [gaitPhase, setGaitPhase] = useState<'fast' | 'slow'>('fast');
  const [case6Text, setCase6Text] = useState('');

  // State to toggle between cases
  const [activeCase, setActiveCase] = useState<'case1' | 'case2' | 'case3' | 'case4' | 'case5'|'case6'>('case1');

  const sendSignal = async (signal: string) => {
    const sending = signal;
    try {
      const response = await fetch("https://areeya.ngrok.app/signal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: sending , tag: 'C3:00:00:2E:6C:06'}),
        }
      )
    if (response.ok) {
      console.log("Signal sent successfully!");
    } else {
      console.error("Failed to send signal.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  
  console.log(sending)
  }


  const handleAnimationCase1 = () => {
    setActiveCase('case1'); // Set the active case to 'case1'
    animatedTopCase1.setValue(50);
    animatedRightCase1.setValue(20);

    Animated.sequence([
      Animated.timing(animatedRightCase1, {
        toValue: 35, // Move left
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCase1, {
        toValue: 45, // Move up
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRightCase1, {
        toValue: 55, // Move left
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCase1, {
        toValue: 40, // Move up
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRightCase1, {
        toValue: 80, // Move left
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleAnimationCase2 = () => {
    setActiveCase('case2'); // Set the active case to 'case2'
    animatedTopCase2.setValue(50);
    animatedRightCase2.setValue(20);

    Animated.sequence([
      Animated.timing(animatedRightCase2, {
        toValue: 35, // Move left
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCase2, {
        toValue: 45, // Move up
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRightCase2, {
        toValue: 55, // Move left again
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCase2, {
        toValue: 67, // Move down (change this to a positive value)
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(()=>{sendSignal('leave')});
  };

  const handleAnimationCase3 = () => {
    setActiveCase('case3');
    setAcceleration(0);
    animatedRotation.setValue(0);

    // Increment acceleration every 100ms
    const interval = setInterval(() => {
      setAcceleration((prev) => {
        if (prev < 9) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 100);

    // Rotate animation (falling flat)
    Animated.timing(animatedRotation, {
      toValue: 90, // Rotate to 90 degrees (horizontal)
      duration: 2000,
      useNativeDriver: false,
    }).start(()=>{sendSignal('Fall')});
  };

  const handleAnimationCase4 = () => {
    setActiveCase('case4');
    setIsCoughing(true);

    // Remove "Coughing" label after 3 seconds
    setTimeout(() => {
      setIsCoughing(false);
    }, 3000);
    sendSignal('Cough')
  };

  const handleAnimationCase5 = () => {
    setActiveCase('case5'); // Set the active case to 'case5'
    setGaitPhase('fast'); // Start with fast walking
  
    // Reset positions to their initial values
    animatedGaitSpeed.setValue(0);
    animatedTopCase5.setValue(50);
    animatedRightCase5.setValue(20);
  
    // Ensure the "walking faster" animation starts from the initial values
    Animated.sequence([
      Animated.timing(animatedRightCase5, {
        toValue: 35, // Move to the right
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCase5, {
        toValue: 45, // Move up
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRightCase5, {
        toValue: 55, // Move to the right
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // After fast walking animation ends, start slow walking and show the text
      setGaitPhase('slow'); // Change gait phase to slow
  
      // Show the "1 month later: Walking slower" text
      setTimeout(() => {
        setGaitPhase('slow'); // Change gait phase to slow
  
        // Now perform the "slow walking" animation sequence
        Animated.sequence([
          Animated.timing(animatedTopCase5, {
            toValue: 40, // Move up
            duration: 3000, // Slow walking speed
            useNativeDriver: false,
          }),
          Animated.timing(animatedRightCase5, {
            toValue: 80, // Move left
            duration: 3000, // Slow walking speed
            useNativeDriver: false,
          }),
        ]).start(()=>{sendSignal('Walk')});
      }, 200); // A slight delay for the text to appear before starting slow walking
    });
  };
  
  
  const handleAnimationCase6 = () => {
    setActiveCase('case6'); // Set active case to 'case6'
    let currentText = 0;

    // Cycle through the texts
    const textInterval = setInterval(() => {
      if (currentText === 0) {
        setCase6Text('10 min');
      } else if (currentText === 1) {
        setCase6Text('30 min');
      } else if (currentText === 2) {
        setCase6Text('1 hour');
      } else if (currentText === 3) {
        setCase6Text('2 hour');
        clearInterval(textInterval); // Stop the interval after the last change
      }
      currentText += 1;
    }, 2000); 
    sendSignal('still')// Change the text every 2 seconds
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./assets/1731128143610.jpg')}
            style={styles.image1}
            resizeMode="contain"
          />
          {activeCase === 'case1' && (
            <Animated.Image
              source={require('./assets/person.png')}
              style={[styles.image2, {
                top: animatedTopCase1.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                right: animatedRightCase1.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }]}
              resizeMode="contain"
            />
          )}
          {activeCase === 'case2' && (
            <Animated.Image
              source={require('./assets/person.png')}
              style={[styles.image3, {
                top: animatedTopCase2.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                right: animatedRightCase2.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }]}
              resizeMode="contain"
            />
          )}
          {activeCase === 'case3' && (
            <>
              <Animated.Image
                source={require('./assets/person.png')}
                style={[styles.image2, {
                  transform: [
                    {
                      rotate: animatedRotation.interpolate({
                        inputRange: [0, 90],
                        outputRange: ['0deg', '90deg'],
                      }),
                    },
                  ],
                }]}
                resizeMode="contain"
              />
              <Text style={styles.accelerationLabel}>
                Acceleration: {acceleration}
              </Text>
            </>
          )}
          {activeCase === 'case4' && (
            <>
              <Image
                source={require('./assets/person.png')}
                style={[styles.image2, {
                  top: '60%', // Adjusted starting top position
                  left: '10%', // Adjusted starting left position
                }]}
                resizeMode="contain"
              />
              {isCoughing && (
                <Text style={styles.coughingLabel}>Coughing</Text>
              )}
            </>
          )}
          {activeCase === 'case5' && (
            <>
              <Animated.Image
                source={require('./assets/person.png')}
                style={[styles.image2, {
                  top: animatedTopCase5.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'], // Adjust top position
                  }),
                  right: animatedRightCase5.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'], // Adjust right position
                  }),
                }]}
                resizeMode="contain"
              />
              {gaitPhase === 'slow' && (
                <Text style={styles.gaitLabel}>1 month later: Walking slower</Text>
              )}
            </>
          )}
          {activeCase === 'case6' && (
            <>
              <Text style={styles.case6Text}>{case6Text}</Text>
              <Image
                source={require('./assets/person.png')}
                style={[styles.image2, {
                  top: '40%', // Adjusted starting top position
                  left: '30%', // Adjusted starting left position
                }]}
                resizeMode="contain"
              />
            </>
            
          )}


        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase1}>
          <Text style={styles.buttonText}>Case 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase2}>
          <Text style={styles.buttonText}>Case 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase3}>
          <Text style={styles.buttonText}>Case 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase4}>
          <Text style={styles.buttonText}>Case 4</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase5}>
          <Text style={styles.buttonText}>Case 5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnimationCase6}>
          <Text style={styles.buttonText}>Case 6</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  footer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap to the next line
    alignItems: 'center',
    justifyContent: 'flex-start', // Center all buttons
    backgroundColor: 'pink',
    paddingVertical: 20, // Add padding for better spacing
  },
  imageContainer: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image1: {
    width: '100%',
    height: '100%',
  },
  accelerationLabel: {
    position: 'absolute',
    top: '10%',
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  image2: {
    width: '10%',
    height: '10%',
    position: 'absolute',
  },
  image3: {
    width: '10%',
    height: '10%',
    position: 'absolute',
  },
  button: {
    marginHorizontal: 10, // Horizontal margin for space between buttons
    marginVertical: 10, // Vertical margin for better row spacing
    borderWidth: 1,
    width: 100, // Fixed width for consistent button sizes
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  buttonText: {
    fontSize: 16,
  },
  coughingLabel: {
    position: 'absolute',
    top: '15%',
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  gaitLabel: {
    position: 'absolute',
    top: '25%',
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
  },
  case6Text: {
    position: 'absolute',
    top: '10%', // Position the text where you want it to appear
    fontSize: 24,
    fontWeight: 'bold',
    color: 'purple', // Color of the text
  },
});

export default Areeya;
