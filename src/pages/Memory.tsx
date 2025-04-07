import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Music, Share2, MessageCircle, Bookmark, ExternalLink, Download, QrCode } from 'lucide-react';
import QRCodeSVG from 'qrcode.react';

const Memory = () => {
  const { id } = useParams();
  const [currentPhotoIndex, setCurrentPhotoIndex] = React.useState(0);
  const [showQRModal, setShowQRModal] = React.useState(false);

  // Função para extrair o ID da música do Spotify
  const getSpotifyEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Para URLs de música do Spotify
    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return `https://open.spotify.com/embed/track/${trackMatch[1]}`;
    }
    
    // Para URLs de playlist do Spotify
    const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
      return `https://open.spotify.com/embed/playlist/${playlistMatch[1]}`;
    }
    
    return null;
  };

  // TODO: Fetch memory data using the id
  const memory = {
    title: "Ritual de Brabuleta",
    message: "você me completou desde: 1 ano, 9 meses, 14 dias, 23 horas, 25 minutos e 41 segundos",
    photos: [], // Will be populated with actual photos
    musicUrl: "https://open.spotify.com/track/5nujrmhLynf4yMoMtj8AQF",
    createdAt: new Date(),
    likes: 117,
    comments: 5,
    shares: 20,
    saved: 13
  };

  const spotifyEmbedUrl = getSpotifyEmbedUrl(memory.musicUrl);

  const handleDownloadQR = () => {
    const canvas = document.createElement("canvas");
    const svg = document.querySelector(".qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg!);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `memoria-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        {/* Gradiente de sobreposição superior */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent z-10" />
        
        {/* Gradiente de sobreposição inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 to-transparent z-10" />

        {/* Conteúdo principal */}
        <div className="relative h-full flex items-center justify-center bg-purple-900/10">
          {memory.photos.length > 0 ? (
            <img
              src={URL.createObjectURL(memory.photos[currentPhotoIndex])}
              alt="Memória"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-pink-900/50">
              <Heart className="w-20 h-20 text-pink-500 animate-pulse" />
            </div>
          )}

          {/* Overlay de conteúdo */}
          <div className="absolute inset-0 z-20">
            <div className="h-full flex flex-col justify-between p-4">
              {/* Cabeçalho */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Memorylit</h1>
                  <p className="text-sm text-gray-300">3-3</p>
                </div>
              </div>

              {/* Conteúdo central - mensagem */}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl font-medium text-center max-w-md">
                  {memory.message}
                </p>
              </div>

              {/* Rodapé com música e interações */}
              <div className="space-y-4">
                {/* Música com Player do Spotify */}
                {memory.musicUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                      <Music className="w-5 h-5 text-white animate-pulse" />
                      <p className="text-sm flex-1">Nossa música especial</p>
                      <a
                        href={memory.musicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Abrir no Spotify
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    
                    {spotifyEmbedUrl && (
                      <div className="rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm">
                        <iframe
                          src={spotifyEmbedUrl}
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

                {/* Interações */}
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">
                      Surpreenda quem você ama nesse dia das mulheres! ❤️ #gift #present
                    </p>
                  </div>
                  
                  {/* Botões de interação */}
                  <div className="flex flex-col items-center gap-4">
                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{memory.likes}</span>
                    </button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{memory.comments}</span>
                    </button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Bookmark className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{memory.saved}</span>
                    </button>

                    <button 
                      className="flex flex-col items-center"
                      onClick={() => setShowQRModal(true)}
                    >
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">QR Code</span>
                    </button>

                    <button className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <span className="text-sm mt-1">{memory.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal do QR Code */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-md border border-purple-500/20 p-3 w-[220px]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-white">QR Code</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="bg-white p-2 rounded mb-2 flex items-center justify-center">
                <QRCodeSVG
                  value={window.location.href}
                  size={120}
                  level="H"
                  className="qr-code-svg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1 bg-purple-900/30 rounded p-1">
                  <input
                    type="text"
                    value={window.location.href}
                    readOnly
                    className="bg-transparent text-gray-300 text-[10px] flex-1 outline-none truncate px-1"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="text-purple-400 hover:text-purple-300 transition-colors px-1.5 py-0.5 text-[10px] font-medium"
                  >
                    Copiar
                  </button>
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center gap-1 w-full py-1 px-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-[10px] font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                >
                  <Download className="w-3 h-3" />
                  Baixar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Memory; 