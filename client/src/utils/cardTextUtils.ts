import { Trait } from "@5rdb/api";

export const formatText = (unformattedText: string) => {
  return unformattedText
    .replace(
      /\[([\w-]+)\]/g,
      (match, p1) => `<span class="icon icon-${p1}"></span>`,
    )
    .replaceAll('<em>', '<em><b>')
    .replaceAll('</em>', '</b></em>');
}

export const convertTraitList = (stringTraits: string[], traits: Trait[]) => {
  return stringTraits.map(stringTrait => (traits.find(trait => stringTrait === trait.id)?.name || stringTrait) + '.').join(' ');
}