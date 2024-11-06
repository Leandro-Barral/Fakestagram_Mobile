import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { uploadPost } from '../services/PostsService';

const CreatePostScreen = () => {
    const [caption, setCaption] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        (async () => {
            const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryPermission.status === 'granted');

            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraPermission.status === 'granted');
        })();
    }, []);

    const pickImageFromGallery = async () => {
        if (!hasGalleryPermission) {
            Alert.alert("Permiso denegado", "Por favor, permite acceso a la galería en la configuración.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        if (!hasCameraPermission) {
            Alert.alert("Permiso denegado", "Por favor, permite acceso a la cámara en la configuración.");
            return;
        }
        setCameraVisible(true);
    };

    const handleCapturePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
            setImageUri(photo.uri);
            setCameraVisible(false);
        }
    };

    const handleUpload = async () => {
        if (!imageUri) {
            Alert.alert("Error", "Por favor, selecciona o toma una foto primero.");
            return;
        }

        const result = await uploadPost(imageUri, caption);

        if (result.success) {
            Alert.alert('Éxito', 'Imagen subida exitosamente');
            setImageUri(null);
            setCaption('');
        } else {
            Alert.alert('Error', result.message);
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
                placeholder="Escribe un caption..."
                value={caption}
                onChangeText={setCaption}
                style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    padding: 10,
                    margin: 10,
                    width: '90%',
                    borderRadius: 5,
                }}
            />
            <Button title="Seleccionar de la Galería" onPress={pickImageFromGallery} />
            <Button title="Tomar una Foto" onPress={takePhoto} />
            
            {cameraVisible && hasCameraPermission && (
                <Camera style={{ width: '100%', height: 300 }} type={Camera.Constants.Type.back} ref={cameraRef}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button title="Capturar" onPress={handleCapturePhoto} />
                        <Button title="Cancelar" onPress={() => setCameraVisible(false)} />
                    </View>
                </Camera>
            )}

            {imageUri && (
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, margin: 10 }} />
            )}
            
            <Button title="Subir Post" onPress={handleUpload} />
        </View>
    );
};

export default CreatePostScreen;
