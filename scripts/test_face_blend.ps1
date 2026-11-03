Add-Type -AssemblyName System.Drawing

$origPath = "C:\Users\ASUS\Downloads\Test images\front.jpeg"
$genPath = "C:\Users\ASUS\.gemini\antigravity\brain\e83e4643-6987-4fb2-8e76-6d2cfaeb22f8\fringe_front.webp"
$outPath = "C:\Users\ASUS\.gemini\antigravity\brain\e83e4643-6987-4fb2-8e76-6d2cfaeb22f8\blended_front.jpg"

$genBmp = [System.Drawing.Bitmap]::FromFile($genPath)
$w = $genBmp.Width
$h = $genBmp.Height

# Scale original to match generated width & height exactly
$origBmpRaw = [System.Drawing.Bitmap]::FromFile($origPath)
$origScaled = [System.Drawing.Bitmap]::new($w, $h)
$g = [System.Drawing.Graphics]::FromImage($origScaled)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($origBmpRaw, 0, 0, $w, $h)
$g.Dispose()
$origBmpRaw.Dispose()

# Create blended bitmap
$resultBmp = [System.Drawing.Bitmap]::new($w, $h)

# Let's inspect blending:
# From y=0 to y=370: 100% generated (new hair and fringe)
# From y=370 to y=430: smooth transition from hair to eyebrows/face
# From y=430 to y=h: 100% original face (exact eyes, nose, mouth, beard, shirt, wall!)

for ($y = 0; $y -lt $h; $y++) {
    $alphaOrig = 0.0
    if ($y -lt 360) {
        $alphaOrig = 0.0
    } elseif ($y -lt 430) {
        # Smooth cosine transition
        $t = ($y - 360) / 70.0
        $alphaOrig = 0.5 * (1.0 - [Math]::Cos($t * [Math]::PI))
    } else {
        $alphaOrig = 1.0
    }
    
    $alphaGen = 1.0 - $alphaOrig
    
    for ($x = 0; $x -lt $w; $x++) {
        $pOrig = $origScaled.GetPixel($x, $y)
        $pGen = $genBmp.GetPixel($x, $y)
        
        $r = [int]($pGen.R * $alphaGen + $pOrig.R * $alphaOrig)
        $gCol = [int]($pGen.G * $alphaGen + $pOrig.G * $alphaOrig)
        $b = [int]($pGen.B * $alphaGen + $pOrig.B * $alphaOrig)
        
        $resultBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $gCol, $b))
    }
}

$resultBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$resultBmp.Dispose()
$origScaled.Dispose()
$genBmp.Dispose()

Write-Output "Saved blended image to: $outPath"
