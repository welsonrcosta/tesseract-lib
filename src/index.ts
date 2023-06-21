import tesseract from './tesseract-ffi'
//import path from 'path'

function main(){
    if (process.argv.length != 3 ){
        console.log("wrong usage")
    }
    const tess = new tesseract('./lang_data','deu')
    console.time('detect')
    const text = tess.detect(process.argv[2])
    console.timeEnd('detect')
    console.log(text)
    tess.close()
}

main()


// function testLeak(){
//     const tess = new tesseract('./lang_data','deu')
//     for(let i =0; i < 1000 ; i++){
//         tess.detect(path.join( "assets", "screenshots", "fullscreen.PNG"))
//     }
//     tess.close()
// }

// testLeak()
