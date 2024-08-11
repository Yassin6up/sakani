import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addImages, deleteImage } from '@/store/slices/publish';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

const Step4 = () => {
    const images = useSelector((state) => state.publishData.value.images);
    const dispatcher = useDispatch();
    const [uploading, setUploading] = useState(false); // State to track upload status
    const { t } = useTranslation();

    const handleUploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        setUploading(true); 

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (pickerResult.canceled === true) {
            setUploading(false); // Reset uploading state if canceled
            return;
        }

        dispatcher(addImages(pickerResult.assets[0]));
        setUploading(false); // Reset uploading state after upload
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("step4Title")}</Text>
            <Text style={styles.subTitle}>{t("step4subTitle")}</Text>
            <View style={styles.boxesContainer}>
                {images.map((image, index) => (
                    <View key={index} style={{ ...styles.box, padding: 0, position: 'relative' }}>
                        <Image key={index} source={{ uri: image.uri }} style={styles.image} />
                        <Pressable
                            onPress={() => dispatcher(deleteImage(index))}
                            style={{
                                position: 'absolute',
                                top: 3,
                                right: 3,
                                width: 30,
                                height: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                borderRadius: 50,
                            }}>
                            <Feather name="trash-2" size={20} color="black" />
                        </Pressable>
                    </View>
                ))}
                {uploading ? (
                    <View style={styles.uploadingBox}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.uploadingText}>{t("loading")}</Text>
                    </View>
                ) : (
                    <Pressable style={styles.box} onPress={handleUploadImage}>
                        <Feather name="upload" size={24} color="grey" />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        fontSize: 20,
        fontFamily: 'droidAr',
        marginHorizontal: 50,
    },
    subTitle: {
        color: 'grey',
        fontFamily: 'droidAr',
        textAlign: 'right',
        marginRight: 50,
    },
    boxesContainer: {
        width: '100%',
        marginTop: 20,
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: 10,
    },
    box: {
        padding: 16,
        display: 'flex',
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    uploadingBox: {
        padding: 16,
        display: 'flex',
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderStyle: 'solid',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        marginTop: 10,
        fontFamily: 'droidAr',
    },
});

export default Step4;
