import tesseract from './tesseract-ffi'

function main(){
    if (process.argv.length != 3 ){
        console.log("wrong usage")
    }
    const tess = new tesseract('./lang_data','deu')
    console.time('detect')
    let text = tess.detect(process.argv[2])
    console.timeEnd('detect')
    console.log(text)
    tess.close()
}

main()
