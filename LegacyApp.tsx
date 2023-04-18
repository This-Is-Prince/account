import React, {useEffect, useState} from 'react';
import {
  Alert,
  AppState,
  Button,
  Linking,
  SafeAreaView,
  Text,
  View,
  Clipboard,
} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const sleep = async (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve as any, timeout));
};

const POLKAWALLET_DEEP_LINK =
  'https://play.google.com/store/apps/details?id=io.polkawallet.www.polka_wallet';
function App(): JSX.Element {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      console.log('app state change: ', nextAppState);
      if (nextAppState === 'active') {
        const url = await Linking.getInitialURL();
        console.log('get initial url: ', url);
        const value = await Clipboard.getString();
        console.log('string: ', value);
        if (url && url.startsWith(POLKAWALLET_DEEP_LINK)) {
          const accountAddress = url.split('/')[2];
          setSelectedAccount(accountAddress);
        }
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleOpenPolkawalletAccounts = async () => {
    try {
      const openLink = async () => {
        try {
          const url = 'https://polkawallet.io';
          if (await InAppBrowser.isAvailable()) {
            const result = await InAppBrowser.open(url, {
              // iOS Properties
              dismissButtonStyle: 'cancel',
              preferredBarTintColor: '#453AA4',
              preferredControlTintColor: 'white',
              readerMode: false,
              animated: true,
              modalPresentationStyle: 'fullScreen',
              modalTransitionStyle: 'coverVertical',
              modalEnabled: true,
              enableBarCollapsing: false,
              // Android Properties
              showTitle: true,
              toolbarColor: '#6200EE',
              secondaryToolbarColor: 'black',
              navigationBarColor: 'black',
              navigationBarDividerColor: 'white',
              enableUrlBarHiding: true,
              enableDefaultShare: true,
              forceCloseOnRedirection: false,
              // Specify full animation resource identifier(package:anim/name)
              // or only resource name(in case of animation bundled with app).
              animations: {
                startEnter: 'slide_in_right',
                startExit: 'slide_out_left',
                endEnter: 'slide_in_left',
                endExit: 'slide_out_right',
              },
              headers: {
                'my-custom-header': 'my custom header value',
              },
            });
            await sleep(800);
            Alert.alert(JSON.stringify(result));
          } else {
            Linking.openURL(url);
          }
        } catch (error: any) {
          Alert.alert(error?.message);
        }
      };
      // await openLink();
      await Linking.openURL(POLKAWALLET_DEEP_LINK);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Button
          title="Open Polkawallet accounts"
          onPress={handleOpenPolkawalletAccounts}
        />
        <Text>Selected account: {selectedAccount || 'None'}</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
