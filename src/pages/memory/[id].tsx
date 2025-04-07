import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ExternalLink } from 'lucide-react';

interface SpotifyTrack {
  name: string;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  artists: Array<{
    name: string;
  }>;
}

interface Memory {
  id: string;
  title: string;
  message: string;
  photos: Array<{
    name: string;
    type: string;
    dataUrl: string;
  }>;
  musicUrl?: string;
  musicData?: SpotifyTrack;
  createdAt: Date;
}

// Função para buscar a memória da API
const fetchMemory = async (id: string): Promise<Memory | null> => {
  try {
    const response = await fetch(`/api/memories/${id}`);
    if (!response.ok) {
      throw new Error('Memória não encontrada');
    }
    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt)
    };
  } catch (error) {
    console.error('Erro ao buscar memória:', error);
    return null;
  }
};

const MemoryPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMemory() {
      if (typeof id === 'string') {
        setIsLoading(true);
        const data = await fetchMemory(id);
        setMemory(data);
        setIsLoading(false);
      }
    }

    loadMemory();
  }, [id]);

  const getSpotifyEmbedUrl = (url: string) => {
    if (!url) return null;
    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando memória...</p>
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Memória não encontrada</h1>
          <p className="text-gray-400">Esta memória não existe ou foi removida.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-8">
          {memory.title}
        </h1>

        {memory.photos.length > 0 && (
          <div className="relative aspect-video mb-8 rounded-2xl overflow-hidden bg-purple-900/20">
            <img
              src={memory.photos[currentPhotoIndex].dataUrl}
              alt={`Foto ${currentPhotoIndex + 1}`}
              className="w-full h-full object-contain"
            />
            {memory.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {memory.photos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPhotoIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-6 mb-8">
          <p className="text-lg text-gray-300 whitespace-pre-wrap">{memory.message}</p>
        </div>

        {memory.musicUrl && memory.musicData && (
          <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              {memory.musicData.album.images[0] && (
                <img
                  src={memory.musicData.album.images[0].url}
                  alt="Capa do álbum"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  {memory.musicData.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {memory.musicData.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <a
                href={memory.musicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Abrir no Spotify
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {getSpotifyEmbedUrl(memory.musicUrl) && (
              <div className="rounded-xl overflow-hidden">
                <iframe
                  src={getSpotifyEmbedUrl(memory.musicUrl) || undefined}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                  className="border-0"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryPage; 