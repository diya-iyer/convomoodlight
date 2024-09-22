import { AssemblyAI } from 'assemblyai'
const client = new AssemblyAI({
    apiKey: 'b022c0038afd47618c3547adaa1109f8' 
  })
  
  // const audioFile = './local_file.mp3'
  const audioFile =
    'https://github.com/AssemblyAI-Community/audio-examples/raw/main/20230607_me_canadian_wildfires.mp3'
  
  const params = {
    audio: audioFile,
    sentiment_analysis: true
  }
  
  const run = async () => {
    const transcript = await client.transcripts.transcribe(params)
  
    for (const result of transcript.sentiment_analysis_results!) {
      console.log(result.text)
      console.log(result.sentiment)
      console.log(result.confidence)
    }
  }
  
  run()