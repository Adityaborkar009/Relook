Add-Type -AssemblyName System.Drawing

$srcFace = "C:\Users\ASUS\.gemini\antigravity\brain\e83e4643-6987-4fb2-8e76-6d2cfaeb22f8\.user_uploaded\media_1793534323108_19e7508a.jpg"
$srcFaceless = "C:\Users\ASUS\.gemini\antigravity\brain\e83e4643-6987-4fb2-8e76-6d2cfaeb22f8\.user_uploaded\media_1793534309112_9dcbd99c.jpg"
$outDir = "C:\Users\ASUS\Downloads\Relook-latest-2026-11-01\Relook\public\hairstyles\textured-fringe"

function Slice-Clean($filePath, $prefix) {
    $bmp = [System.Drawing.Bitmap]::FromFile($filePath)
    
    # Clean regions excluding top title and bottom labels
    # Top row: y=65 to y=490 (height 425), x=15 to x=500 and x=524 to x=1009
    # Bottom row: y=530 to y=960 (height 430), x=15 to x=500 and x=524 to x=1009
    $quadrants = @{
        "front" = [System.Drawing.Rectangle]::new(15, 65, 485, 425);
        "left"  = [System.Drawing.Rectangle]::new(524, 65, 485, 425);
        "back"  = [System.Drawing.Rectangle]::new(15, 530, 485, 430);
        "right" = [System.Drawing.Rectangle]::new(524, 530, 485, 430);
    }
    
    foreach ($entry in $quadrants.GetEnumerator()) {
        $viewName = $entry.Key
        $rect = $entry.Value
        $crop = [System.Drawing.Bitmap]::new($rect.Width, $rect.Height)
        $g = [System.Drawing.Graphics]::FromImage($crop)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmp, [System.Drawing.Rectangle]::new(0, 0, $crop.Width, $crop.Height), $rect, [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        
        $outPath = Join-Path $outDir ("$prefix$viewName.jpg")
        $crop.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
        $crop.Dispose()
        Write-Output "Saved: $outPath"
    }
    
    $bmp.Dispose()
}

Slice-Clean $srcFace ""
Slice-Clean $srcFaceless "faceless-"
Copy-Item $srcFace (Join-Path $outDir "display-collage.jpg") -Force
Copy-Item $srcFaceless (Join-Path $outDir "reference-faceless-collage.jpg") -Force
Write-Output "Done clean slicing!"
