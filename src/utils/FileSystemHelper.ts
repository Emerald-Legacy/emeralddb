import fs from 'fs'

export function getFilesInDirectory(dir: string, allFiles?: string[]): string[] {
  allFiles = allFiles || []
  const files = fs.readdirSync(dir)
  for (const i in files) {
    const name = dir + '/' + files[i]
    if (fs.statSync(name).isDirectory()) {
      getFilesInDirectory(name, allFiles)
    } else {
      allFiles.push(name)
    }
  }
  return allFiles
}

export function readFile(path: string): string {
  return fs.readFileSync(path, { flag: 'rs', encoding: 'utf8' })
}
