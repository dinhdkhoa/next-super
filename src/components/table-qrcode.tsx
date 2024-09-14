import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { getTableLink } from '@/lib/utils';

function TableQRCode({ token, tableNumber, width = 250 }: { token: string; tableNumber: number, width?: number }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        canvas.width = width
        canvas.height = width + 70
        const canvasContext = canvas.getContext('2d')!

        canvasContext.fillStyle = 'white'
        canvasContext.fillRect(0 , 0, width, width + 70)
        canvasContext.font = '20px Arial'
        canvasContext.textAlign = 'center'
        canvasContext.fillStyle = 'black'

        canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width/2, canvas.width + 20)
        canvasContext.fillText(`Quét QR để gọi món`, canvas.width/2, canvas.width + 50)

        const qrCanvas = document.createElement('canvas')

        QRCode.toCanvas(qrCanvas, getTableLink({ token, tableNumber }),
            function (error) {
                if (error) console.error(error)
                canvasContext.drawImage(qrCanvas, 0, 0, width, width)
            })
    }, [tableNumber, token])

    return (
        <canvas
            // width={width}
            ref={canvasRef}
        />
    )
}

export default TableQRCode