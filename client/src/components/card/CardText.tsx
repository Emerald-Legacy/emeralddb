export function CardText(props: {text?: string}): JSX.Element {
  const formatText = (unformattedText: string) => {
    return unformattedText
      .replace(
        /\[([\w-]+)\]/g,
        (match, p1) => `<span class="icon icon-${p1}"></span>`,
      )
      .replace('<em>', '<em><b>')
      .replace('</em>', '</b></em>');
  }
  
  const formattedText = props.text ? formatText(props.text) : ''

  return <span dangerouslySetInnerHTML={{__html: formattedText}} />
}