Add-Type -AssemblyName System.Drawing
foreach ($file in Get-ChildItem "servicio_images\Web-medida*.jpg") {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $bmp = new-object System.Drawing.Bitmap($img)
    
    # Get top-left pixel color as background
    $bg = $bmp.GetPixel(0,0)
    
    $left = 0
    $right = $bmp.Width - 1
    $top = 0
    
    # Find left border
    for ($x=0; $x -lt $bmp.Width/2; $x++) {
        $c = $bmp.GetPixel($x, $bmp.Height/2)
        if ($c.R -ne $bg.R -or $c.G -ne $bg.G -or $c.B -ne $bg.B) { $left = $x; break }
    }
    # Find right border
    for ($x=$bmp.Width-1; $x -gt $bmp.Width/2; $x--) {
        $c = $bmp.GetPixel($x, $bmp.Height/2)
        if ($c.R -ne $bg.R -or $c.G -ne $bg.G -or $c.B -ne $bg.B) { $right = $x; break }
    }
    
    $contentWidth = $right - $left
    $zoom = 100
    if ($contentWidth -gt 0) {
        $zoom = [math]::Round(($bmp.Width / $contentWidth) * 100)
    }
    
    Write-Host "$($file.Name): bg=($($bg.R),$($bg.G),$($bg.B)) left=$left right=$right contentWidth=$contentWidth recommendedZoom=$zoom%"
    $img.Dispose()
    $bmp.Dispose()
}
