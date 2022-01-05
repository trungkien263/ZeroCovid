import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
let {width, height} = Dimensions.get('window');

export default function ModalViewImage(props) {
  const {showImageModal, img, setShowModal} = props;
  return (
    <Modal
      isVisible={showImageModal}
      style={{
        margin: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
      }}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      onBackdropPress={setShowModal}
      backdropTransitionOutTiming={500}>
      <FastImage
        source={{uri: img}}
        style={{
          width: width,
          height: width - 32,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
