import { Ruling } from "@5rdb/api";
import { Grid, makeStyles, Box } from "@material-ui/core";
import ReactMarkdown from 'react-markdown'

const useStyles = makeStyles(() => ({
}))

export function RulingList(props: {rulings: Pick<Ruling, "link" | "source" | "text" | "id">[]}): JSX.Element {
  const classes = useStyles()

  return <Grid container spacing={1}>
    {props.rulings.map(ruling => (
      <Grid key={ruling.id} item xs={12}>
        <Box border='1px solid' borderColor='lightgrey' marginTop={1} padding={2} borderRadius={3}>
          <ReactMarkdown>
            {`${ruling.text} \n\n ~ [${ruling.source}](${ruling.link})`}</ReactMarkdown>
        </Box>   
      </Grid>
    ))}
  </Grid>
}