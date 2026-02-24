import './style.css';

const startButton = document.getElementById('startButton') as HTMLButtonElement;
const scanner = document.getElementById('scanner') as HTMLDivElement;
const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const result = document.getElementById('result') as HTMLDivElement;

startButton.addEventListener('click', start);

async function start(): Promise<void> {
  if (typeof BarcodeDetector === 'undefined') {
    alert('この環境では BarcodeDetector API が利用できません');
    return;
  }

  // BarcodeDetector のインスタンスを生成、フォーマットに QR コードを指定
  const detector = new BarcodeDetector({ formats: ['qr_code'] });

  let stream: MediaStream;

  try {
    // カメラのメディアストリームを取得
    stream = await navigator.mediaDevices.getUserMedia({
      // 可能なら背面カメラを使う
      video: { facingMode: 'environment' },
    });
  } catch {
    alert('カメラを利用できませんでした');
    return;
  }

  startButton.hidden = true;
  scanner.hidden = false;

  // video の srcObject にカメラのメディアストリームをセット
  video.srcObject = stream;
  video.onplaying = scanLoop;

  // QR コードを検出するループ処理
  async function scanLoop(): Promise<void> {
    try {
      // バーコード（今回は QR コード）を検出
      const barcodes = await detector.detect(video);

      if (barcodes.length > 0) {
        // QR コードが1件以上検出されている
        const barcode = barcodes[0]
        video.pause();

        if (navigator.vibrate) {
          // 端末を一瞬ブルッとさせる
          navigator.vibrate(200)
        }

        // QR コードの四隅を線で結んで検出箇所を示す
        drawCornerPoints(barcode.cornerPoints);

        // 取得された値を画面に示す
        showResult(barcode.rawValue);

        // ループを抜けて終了
        return;
      }
    } catch (error) {
      console.log(error);
    }

    // QR コードが検出されていなければループを繰り返す
    requestAnimationFrame(scanLoop);
  }
}

function drawCornerPoints(cornerPoints: CornerPoint[]): void {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx || cornerPoints.length === 0) {
    return;
  }

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(cornerPoints[0].x, cornerPoints[0].y);

  for (let i = 1; i < cornerPoints.length; i++) {
    ctx.lineTo(cornerPoints[i].x, cornerPoints[i].y);
  }

  ctx.closePath();
  ctx.stroke();
}

function showResult(value: string): void {
  result.innerText = value;
}

