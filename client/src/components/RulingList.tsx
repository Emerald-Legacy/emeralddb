import { Ruling } from '@5rdb/api'
import {
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useConfirm } from 'material-ui-confirm'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { privateApi } from '../api'
import { useCurrentUser } from '../providers/UserProvider'

const useStyles = makeStyles((theme) => ({
  editButton: {
    backgroundColor: theme.palette.warning.light,
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
  },
  createButton: {
    marginRight: theme.spacing(1),
    marginLeft: 'auto',
    marginTop: theme.spacing(2),
  },
  deleteButton: {
    backgroundColor: theme.palette.error.light,
  },
  input: {
    marginBottom: theme.spacing(1),
  },
}))

export function RulingList(props: { cardId: string; rulings: Ruling[] }): JSX.Element {
  const classes = useStyles()
  const { isRulesAdmin } = useCurrentUser()
  const confirm = useConfirm()
  const [rulingModalOpen, setRulingModalOpen] = useState(false)
  const [rulingId, setRulingId] = useState(-1)
  const [rulingText, setRulingText] = useState('')
  const [rulingSource, setRulingSource] = useState('')
  const [rulingLink, setRulingLink] = useState('')
  const currentHost = window.location.host
  const currentProtocol = window.location.protocol
  const host = currentProtocol + '//' + currentHost
  const { enqueueSnackbar } = useSnackbar()

  function editRuling(ruling: Ruling) {
    setRulingId(ruling.id)
    setRulingText(ruling.text)
    setRulingSource(ruling.source)
    setRulingLink(ruling.link)
    setRulingModalOpen(true)
  }

  function createRuling() {
    setRulingId(-1)
    setRulingText('')
    setRulingSource('')
    setRulingLink('')
    setRulingModalOpen(true)
  }

  function confirmDeletion(ruling: Ruling) {
    confirm({ description: 'Do you really want to delete this ruling?' })
      .then(() => {
        privateApi.Ruling.delete({ rulingId: ruling.id })
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
            enqueueSnackbar("The ruling couldn't be deleted!", { variant: 'error' })
          })
      })
      .catch(() => {
        // Cancel confirmation dialog => do nothing
      })
  }

  function createOrUpdateRuling() {
    if (rulingId === -1) {
      confirm({ description: 'Do you really want to create this ruling?' })
        .then(() => {
          privateApi.Ruling.create({
            body: {
              card_id: props.cardId,
              text: rulingText,
              source: rulingSource,
              link: rulingLink,
            },
          })
            .then(() => {
              window.location.reload()
            })
            .catch((error) => {
              console.log(error)
              enqueueSnackbar("The ruling couldn't be created!", { variant: 'error' })
            })
        })
        .catch(() => {
          // Cancel confirmation dialog => do nothing
        })
    } else {
      confirm({ description: 'Do you really want to update this ruling?' })
        .then(() => {
          privateApi.Ruling.update({
            rulingId: rulingId,
            body: {
              id: rulingId,
              card_id: props.cardId,
              text: rulingText,
              source: rulingSource,
              link: rulingLink,
            },
          })
            .then(() => {
              window.location.reload()
            })
            .catch((error) => {
              console.log(error)
              enqueueSnackbar("The ruling couldn't be created!", { variant: 'error' })
            })
        })
        .catch(() => {
          // Cancel confirmation dialog => do nothing
        })
    }
  }

  function replaceLinkTo5rdb(link: string): string {
    let newText = link
    if (link?.includes('https://fiveringsdb.com')) {
      newText = newText.replaceAll('https://fiveringsdb.com', host)
    }
    if (newText?.includes('/rules/reference')) {
      newText = newText.replaceAll('/rules/reference', '/rules/emerald')
    }
    return newText || ''
  }

  return (
    <Grid container spacing={1}>
      {props.rulings.map((ruling) => (
        <Grid key={ruling.id} item xs={12}>
          <Box
            border="1px solid"
            borderColor="lightgrey"
            marginTop={1}
            padding={2}
            borderRadius="3px"
          >
            <ReactMarkdown>
              {`${replaceLinkTo5rdb(ruling.text)} \n\n ~ [${ruling.source}](${replaceLinkTo5rdb(
                ruling.link
              )})`}
            </ReactMarkdown>
          </Box>
          {isRulesAdmin() && (
            <Box bgcolor="#eeeeee" padding={1} display="flex">
              <Button
                variant="contained"
                className={classes.editButton}
                onClick={() => editRuling(ruling)}
              >
                Edit Ruling
              </Button>
              <Button
                variant="contained"
                className={classes.deleteButton}
                onClick={() => confirmDeletion(ruling)}
              >
                Delete Ruling
              </Button>
            </Box>
          )}
        </Grid>
      ))}
      {isRulesAdmin() && (
        <Button
          variant="contained"
          className={classes.createButton}
          color="secondary"
          onClick={() => createRuling()}
        >
          Create New Ruling
        </Button>
      )}
      <Dialog open={rulingModalOpen} onClose={() => setRulingModalOpen(false)}>
        <DialogTitle>{rulingId === -1 ? 'Create New Ruling' : 'Edit Ruling'}</DialogTitle>
        <DialogContent>
          <TextField
            value={rulingText}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setRulingText(e.target.value)}
            label="Text"
            className={classes.input}
          />
          <Box padding={2} border="1px solid lightgray" className={classes.input}>
            <Typography>Preview:</Typography>
            <ReactMarkdown>{rulingText}</ReactMarkdown>
          </Box>
          <TextField
            value={rulingSource}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setRulingSource(e.target.value)}
            label="Source"
            className={classes.input}
          />
          <TextField
            value={rulingLink}
            multiline
            variant="outlined"
            fullWidth
            onChange={(e) => setRulingLink(e.target.value)}
            label="Link"
            className={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRulingModalOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
          <Button variant="contained" color="secondary" onClick={() => createOrUpdateRuling()}>
            {rulingId === -1 ? 'Create New Ruling' : 'Edit Ruling'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
