import mongoose from 'mongoose';

async function fixSongs() {
  await mongoose.connect('mongodb://root:password123@localhost:27017/ai_lyrics?authSource=admin');
  const songs = mongoose.connection.collection('songs');

  const result = await songs.updateMany(
    { createdBy: { $type: 'string' } },
    { $unset: { createdBy: '' } }
  );

  console.log('✅ Fix complete:', result);
  await mongoose.disconnect();
}

fixSongs();
