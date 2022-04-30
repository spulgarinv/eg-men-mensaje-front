import React from "react";
import { useEffect, useState } from "react";
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Button, TextField, Select, MenuItem } from "@material-ui/core";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import { AppBar, Box, Toolbar, Typography, Container, FormControl } from "@material-ui/core"
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@material-ui/core";
import axios from "axios";

const BASE_URL = "https://eg-men-back.herokuapp.com/api/v1/messages/"

const useStyles = makeStyles((theme) => ({
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData] = useState([]);
  const [modalInsert, setModalInsert] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [message, setMessage] = useState({
    "subject": "",
    "body": "",
    "attachment": "",
    "status": ""
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setMessage(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(message);
  }

  const getMessages = async() => {
    await axios.get(BASE_URL)
      .then(response => {
        setData(response.data.data);
      })
  }

  const postMessage = async() => {
    const message_body = {
      "subject": message["subject"],
      "body": message["body"],
      "attachment": message["attachment"]
    }

    await axios.post(BASE_URL, message_body)
      .then(response => {
        setMessage([])
        getMessages();
        abrirCerrarModalInsertar();
      })
  }

  const putMessage = async() => {
    const message_body = {
      "subject": message["subject"],
      "body": message["body"],
      "attachment": message["attachment"],
      "status": message["status"]
    }

    await axios.put(BASE_URL + message.id, message_body)
      .then(response => {
        getMessages()
        abrirCerrarModalUpdate();
      })
  }

  const deleteMessage = async() => {
    await axios.delete(BASE_URL + message.id)
      .then(response => {
        getMessages()
        abrirCerrarModalDelete();
      })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsert(!modalInsert);
  }

  const abrirCerrarModalUpdate = () => {
    setModalUpdate(!modalUpdate);
  }

  const abrirCerrarModalDelete = () => {
    setModalDelete(!modalDelete);
  }

  useEffect(() => {
    getMessages();
  }, [])

  const bodyCreate = (
    <>
      <DialogTitle>
        Agregar Nuevo Mensaje
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Ingresa la informacion en el formulario para crear un nuevo mensaje.
        </DialogContentText>
        <TextField required name="subject" label="Asunto" fullWidth margin="dense" onChange={handleChange} />
        <TextField required name="body" label="Cuerpo" fullWidth multiline margin="dense" onChange={handleChange} />
        <TextField name="attachment" label="Adjunto" fullWidth multiline margin="dense" onChange={handleChange} />
        <DialogActions>
          <Button color="primary" onClick={() => postMessage()}>Insertar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const bodyUpdate = (
    <>
      <DialogTitle>
        Editar Mensaje
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Modifica la informacion en el formulario para editar el mensaje.
        </DialogContentText>
        <TextField required name="subject" label="Asunto" fullWidth margin="dense" onChange={handleChange} value={message.subject} />
        <TextField required name="body" label="Cuerpo" fullWidth margin="dense" onChange={handleChange} value={message.body} />
        <TextField name="attachment" label="Adjunto" fullWidth onChange={handleChange} value={message.attachment} />
        <Select
          style={{ marginTop: '22px' }}
          name="status"
          margin="dense"
          value={message.status}
          onChange={handleChange}
          label="Estado"
          fullWidth
        >
          <MenuItem value="created">Created</MenuItem>
          <MenuItem value="sent">Sent</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="undelivered">Undelivered</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
        </Select>
        <DialogActions>
          <Button color="primary" onClick={() => putMessage()}>Editar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalUpdate()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const bodyEliminar = (
    <>
      <DialogTitle id="alert-dialog-title">
        Eliminar Mensaje
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Seguro quiere eliminar el mensaje <b>[{message.id}] {message.subject}</b>?
        </DialogContentText>
        <DialogActions>
          <Button color="primary" onClick={() => deleteMessage()}>Eliminar</Button>
          <br />
          <Button color="primary" onClick={() => abrirCerrarModalDelete()}>Cancelar</Button>  
        </DialogActions>
      </DialogContent>
    </>
  )

  const seleccionarConsola=(message, caso)=>{
    setMessage(message);
    (caso==='Editar') ? abrirCerrarModalUpdate() : abrirCerrarModalDelete()
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Evergreen - MEN
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container style={{ marginTop: '30px' }}>
        <Typography
          variant="h3"
          noWrap
          component="div"
          sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
        >
          Mensajes
        </Typography>
        <br/>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => abrirCerrarModalInsertar()}>Nuevo</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Body</TableCell>
                <TableCell>Attachment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell>Updated at</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.body}</TableCell>
                  <TableCell>{item.attachment ? item.attachment : '-'}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>{item.updated_at}</TableCell>
                  <TableCell>
                    <Edit className={styles.iconos} onClick={() => seleccionarConsola(item, 'Editar')} />
                    &nbsp;&nbsp;&nbsp;
                    <Delete className={styles.iconos} onClick={() => seleccionarConsola(item, 'Eliminar')} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog
        open={modalInsert}
        onClose={abrirCerrarModalInsertar}
      >
        {bodyCreate}
      </Dialog>

      <Dialog
        open={modalUpdate}
        onClose={abrirCerrarModalUpdate}
      >
        {bodyUpdate}
      </Dialog>

      <Dialog
        open={modalDelete}
        onClose={abrirCerrarModalDelete}
      >
        {bodyEliminar}
      </Dialog>

    </div>
  )
}

export default App;