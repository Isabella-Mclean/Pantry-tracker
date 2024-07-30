'use client'
import { Box, Stack, Typography, Button, Modal, stepLabelClasses, TextField, IconButton, Alert } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {firestore} from "@/firebase";
import { collection, doc, query,getDocs, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import backgroundImage from './background.jpg'
import '@fontsource-variable/quicksand';
import { Remove } from "@mui/icons-material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  backgroundColor: 'rgba(255,255,255, 0.9)',
  borderRadius:5,
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [alert, setAlert] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  
  const handleOpenSearch = () => setOpenSearch(true);
  const handleCloseSearch = () => setOpenSearch(false);

  const [itemName, setItemName] = useState('')

  const updatePantry = async()=>{
    const snapshot = query(collection(firestore,'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) =>{
      pantryList.push({name:doc.id, ...doc.data()})
    })
    setPantry(pantryList)
  }

  useEffect(() => {
    
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    //Check if it already exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count+1})
    }else{
      await setDoc(docRef,{count:1})
    }
    await updatePantry()
  }

  const removeItem = async (item) => { 
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    await deleteDoc(docRef)
    await updatePantry()
  }
  const searchItem = async(item) =>{
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      //Make an alert with the number of the found item
      setAlert({
        severity: 'success',
        message: `Your item, ${item}, was found! Quantity: ${docSnap.data().count}`,
      });
    }else{
      //Make an alert saying the item wasn't found
      setAlert({
        severity: 'error',
        message: 'Your item was not found',
      });
    }
  }  
  
  const reduceItem = async(item) =>{
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
      const {count} = docSnap.data()
      if(count == 1){
        await deleteDoc(docRef)
      }else{
        await setDoc(docRef, {count: count-1})
      } 
    }
    await updatePantry()
  }


  return (
    <Box 
    width="100vw" 
    height="100vh"
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    flexDirection={"column"}
    gap={2}
    sx={{
      backgroundImage: `url(/_next/static/media/background.d848784f.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    >
      <Modal
        open={openAdd}
        onClose={handleCloseAdd }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily={'Quicksand Variable'}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField 
            id="outlined-basic" 
            label='Item' 
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            ></TextField>
            <Button 
            variant="contained" 
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleCloseAdd ()
            }}
            sx={{
              backgroundColor: 'rgba(193,177,160, 0.5)', 
              color:'rgba(40,40,40, 0.9)',
              '&:hover': {
                  backgroundColor:  'rgba(89,70,48, 0.6)',
                  color: 'white' 
                  }
            }}>
              Add</Button>
          </Stack>
        </Box>
      </Modal>


      <Modal
        open={openSearch}
        onClose={handleCloseSearch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily={'Quicksand Variable'}>
            Search Item
          </Typography>
          <Stack width="100%" direction={'column'} spacing={2}>
            <TextField 
            id="outlined-basic" 
            label='Item' 
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            ></TextField>
            <Button 
            variant="contained" 
            onClick={() => {
              searchItem(itemName)
              setItemName('')
              handleCloseSearch()
            }}
            sx={{
              backgroundColor: 'rgba(193,177,160, 0.5)',
              color:'rgba(40,40,40, 0.9)',
              '&:hover': {
                  backgroundColor:  'rgba(89,70,48, 0.6)',
                  color: 'white' 
                  }
            }}>
              Search</Button>
          </Stack>
        </Box>
      </Modal>

      {alert && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert(null)}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          {alert.message}
        </Alert>
      )}

      <Stack direction={'row'} spacing={5}>
        <Button 
        variant="contained"
        onClick={handleOpenAdd}
        sx={{
          backgroundColor: 'rgba(193,177,160, 0.5)',
          '&:hover': {
                  backgroundColor:  'rgba(89,70,48, 0.6)',
                  color: 'white' 
                  }
        }}
        >Add </Button>
        <Button 
        variant="contained"
        onClick={handleOpenSearch}
        sx={{
          backgroundColor: 'rgba(193,177,160, 0.5)',
          '&:hover': {
                  backgroundColor:  'rgba(89,70,48, 0.6)',
                  color: 'white' 
                  }
        }}
        >Search </Button>
      </Stack>
      
      <Box>
        
        {/** Box surrounding pantry items text */}
        <Box
        width="800px"
        height="100px"
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        borderRadius="16px"
        marginBottom={1}
        sx={{
          backgroundColor: 'rgba(193,177,160, 0.5)' 
        }}
        >
          <Typography 
          variant={"h2"}
          color={"#333"}
          textAlign={'center'}
          fontFamily={'Quicksand Variable'}
          paddingY={2}>
            Pantry Items
          </Typography>
        </Box>
        {/**For the item box and each individual item */}
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"} >
          {pantry.map(({name, count})=>(
              <Box
              key={name}
              width="100%"
              minHeight="70px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              borderRadius="16px"
              paddingX={5}
              overflow={'auto'}
              whiteSpace={'wrap'}
              sx={{
                backgroundColor: 'rgba(255,255,255, 0.7)' 
              }}
              >
                <Typography
                variant={"h3"}
                color={'#333'}
                textAlign={'center'}
                fontFamily={'Quicksand Variable'}
                fontSize={30}
                >
                  {
                  //Capitalise the first letter 
                  name.charAt(0).toUpperCase()+name.slice(1)
                  }
                </Typography>
                <Typography 
                  variant={"h3"}
                  color={'#333'}
                  textAlign={'center'}
                  fontFamily={'Quicksand Variable'}
                  fontSize={30}
                  >
                    Quantity: {count}
                </Typography> 
                <IconButton aria-label="add" onClick={() => addItem(name)}>
                <AddIcon fontSize="large"/>
                </IconButton>
                <IconButton aria-label="delete" onClick={() => reduceItem(name)}>
                <RemoveIcon fontSize="large"/>
                </IconButton>
                <IconButton aria-label="delete" onClick={() => removeItem(name)}>
                <DeleteIcon fontSize="large"/>
                </IconButton>
              </Box>
        ))}
      </Stack>
      </Box>
    </Box>
  );
}
