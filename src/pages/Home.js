import React, { useState, useEffect } from 'react';
import { Text, View,StyleSheet,TouchableOpacity,FlatList,Alert, Keyboard, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export function Home(){

    const keyAsyncStorage = "@agenda:contatos";   

    const [user,setUser] = useState('');
    const [phone,setPhone] = useState('');
    //vetor dos contatos
    const [contacts,setContacts] = useState([]);


   async function handleSaveContacts() {
        const data ={
            id: String (new Date().getTime()),
            name: user,
            phone: phone 
        }    

        const vetData = [...contacts, data]  
        try {
            await AsyncStorage.setItem(keyAsyncStorage, JSON.stringify(vetData));
        } catch (error) {
            Alert.alert("Não foi possível salvar contato");
        }

        Keyboard.dismiss();      
        setUser("");
        setPhone("");
        loadData();       
        
    }

    async function handleDeleteContact( id ) {
        const newData = contacts.filter( item => item.id != id );
        await AsyncStorage.setItem(keyAsyncStorage, JSON.stringify( newData ));
                
        await loadData()
    }

    async function loadData(){
        try{
            const retorno = await AsyncStorage.getItem(  keyAsyncStorage  );   
            const dadosContacts = await JSON.parse( retorno )
            console.log( 'loadData -> ', dadosContacts );
            setContacts( dadosContacts || [] );
        }catch(error){
            Alert.alert("Erro na leitura  dos dados");
        }
    }

    useEffect( ()=>{
        loadData();      
     } , []);
 

    return(
        <View style={ styles.container}>
            <View style={ styles.head }>
                <Text style={styles.titlehead}>AGENDA TELEFÔNICA DDM</Text>
            </View>
           <View style={styles.formContainer}>
            <View style={styles.inputArea}>
            <Icon style={styles.margin} name="user" size={28} color='#999'></Icon>
           <TextInput                 
                      placeholderTextColor="#555"   
                     placeholder="Nome"
                     onChangeText={(e)=>setUser(e)}
                     value={user}
                     style={styles.input}/>
            </View>
            <View style={styles.inputArea}>
            <Icon style={styles.margin} name="phone" size={28} color='#999'></Icon>
            <TextInput                 
                      placeholderTextColor="#555"   
                     placeholder="Telefone"
                     onChangeText={(e)=>setPhone(e)}
                     value={phone}
                     style={styles.input}/> 
            </View>
                <TouchableOpacity style={ styles.button }onPress={handleSaveContacts}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>
            

            <View style={styles.list}>  
                <Text style={styles.titleList}>Lista de Contatos</Text>
               
                <FlatList  data={contacts}  
                    keyExtractor={item => item.id} 
                    renderItem={ ({item}) =>  (
                        <View style={styles.contato}>
                        <View style={styles.margin}>
                            <Text style={styles.texto}>{item.name}</Text>
                            <Text>{item.phone}</Text>
                        </View>
                            <TouchableOpacity onPress={()=>handleDeleteContact(item.id)}>
                                <Icon style={styles.margin} name="trash" size={28} color='#00000'></Icon>
                            </TouchableOpacity>
                        </View>
                    ) }
                /> 
            </View>        
            
        </View>

    );
    
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 35,
        paddingVertical: 40,
        alignItems: 'center',
    },
    head:{
        width: '100%',
        height: 35,
        marginTop:-40,
        backgroundColor: '#3425a8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titlehead:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        
    },
    formContainer:{
        width: "85%",
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'

    },
    button: {
        backgroundColor: '#3425a8',
        padding: 10,
        borderRadius: 7,
        alignItems: 'center',
        marginTop: 20,
        width: 300,
        
    },
    buttonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    list:{
        width: "90%",
    },
    titleList:{
        marginTop: 40,
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputArea:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderWidth: 1,
        borderColor:'#3425a8',
        borderRadius: 10,
        margin:5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        margin: 2,
        flex: 1,
        left:15,
        color: '#000000',
        fontSize: 16,
        borderRadius: 7
    },
    contato:{
        height: 65,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderWidth: 1,
        borderColor: '#B6B4B4',
        borderRadius: 10,
        margin: 10,
    },
    texto:{
        fontSize: 18,
        fontWeight: '500'
    },
    margin:{
        marginLeft:10,
        marginRight:2,
    }
});