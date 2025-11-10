import React from 'react';
import { ScrollView, Image, StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

import * as Boxo from '@appboxo/expo-boxo-sdk';
import { MiniappData } from '@appboxo/expo-boxo-sdk';

const clientId = '602248';
const authCode = 'tNCYV57xV03Ds3ar63oQtddQxUxCRY';
const appId = 'app16973';

export default function App() {
  const [appIdText, onChangeAppIdText] = React.useState(appId);

  const [miniapps, setMiniapps] = React.useState<Array<MiniappData>>([]);

  Boxo.setConfig({ clientId: clientId, multitaskMode: true, consentScreenConfig: {requiredFieldsDescription: "you can get the app id from FE engineers and test the miniapp with our mobile demo app, Zhan can advise you how to properly test, you can ping him on slack "} });
  Boxo.addAuthListener((authEvent) => {
    Boxo.setAuthCode(authEvent.appId, authCode)
  });
  Boxo.addPaymentEventListener((paymentData) => {
    Boxo.hideMiniapps();
    paymentData.status = "success";
    Boxo.sendPaymentEvent(paymentData);
    Boxo.openMiniapp({ appId: paymentData.appId })
  });
  Boxo.addCustomEventListener((customEvent) => {
    console.log(customEvent);
    Boxo.sendCustomEvent(customEvent);
  });
  Boxo.addMiniappLifecycleListener((lifecycleData) => {
    console.log(lifecycleData);
  });
  return (
    <View style={styles.container}>
      <Text style={styles.miniappTitle}>Miniapp Id</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeAppIdText}
        value={appIdText}
      />
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() =>
          Boxo.openMiniapp({ appId: appIdText })
        }>
          <Text style={styles.buttonLabel}>Open Miniapp</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {miniapps.length > 0 &&
          miniapps.map((app, index) => (
            <View key={index}>
              <Pressable style={styles.miniappContainer} onPress={() => { Boxo.openMiniapp({ appId: app.appId }) }}>
                {app.logo && (
                  <Image source={{ uri: app.logo }} style={styles.logo} />
                )}
                <Text style={styles.miniappTitle}>{app.name}</Text>
              </Pressable>
            </View>
          ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    width: 200,
    height: 52,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
    width: '100%'
  },
  miniappContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  miniappTitle: {
    color: '#000000',
    marginStart: 16,
  },
  miniappsTitle: {
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
    fontSize: 24
  },
  logo: {
    width: 50,
    height: 50,
  },
});
