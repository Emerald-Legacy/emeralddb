import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import { useState } from "react";

export function MultiCheckbox(props: {label: string, items: {id: string, name: string}[], onChange: (formats: string[]) => void, defaultItems?: string[]}): JSX.Element {
  
  const [chosenItems, setChosenItems] = useState<string[]>(props.defaultItems || []);

  const isChecked = (id: string) => {
    return chosenItems.includes(id)
  }

  const check = (id: string) => {
    let newItems = [...chosenItems];
    if (isChecked(id)) {
      const index = newItems.indexOf(id);
      newItems.splice(index, 1)
    } else {
      newItems.push(id);
    }
    setChosenItems(newItems);
    props.onChange(newItems);
  }

  return <FormControl component="fieldset">
  <FormLabel component="legend">{props.label}</FormLabel>
  <FormGroup>
    {props.items.map(item => (<FormControlLabel
      key={item.id}
      control={<Checkbox checked={isChecked(item.id)} onChange={() => check(item.id)} name={item.name} />}
      label={item.name}
    />))}
  </FormGroup>
</FormControl>
}