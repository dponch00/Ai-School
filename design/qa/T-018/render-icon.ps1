Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$icons = Join-Path $root 'public/icons'

function Draw-Icon {
  param([System.Drawing.Graphics]$Graphics, [double]$Scale, [double]$OffsetX = 0, [double]$OffsetY = 0)

  $state = $Graphics.Save()
  $Graphics.TranslateTransform($OffsetX, $OffsetY)
  $Graphics.ScaleTransform($Scale, $Scale)
  $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $Graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

  $ink = [System.Drawing.ColorTranslator]::FromHtml('#172A33')
  $paper = [System.Drawing.ColorTranslator]::FromHtml('#FFFDF7')
  $selection = [System.Drawing.ColorTranslator]::FromHtml('#DCECF5')
  $teal = [System.Drawing.ColorTranslator]::FromHtml('#006E74')
  $ochre = [System.Drawing.ColorTranslator]::FromHtml('#A94E2B')
  $Graphics.FillRectangle([System.Drawing.SolidBrush]::new($ink), 0, 0, 512, 512)

  $paperPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $paperPath.AddBezier(118, 346, 118, 270, 150, 182, 232, 122)
  $paperPath.AddBezier(232, 122, 279, 88, 342, 89, 398, 108)
  $paperPath.AddLine(398, 108, 398, 362)
  $paperPath.AddBezier(398, 362, 345, 398, 271, 400, 212, 371)
  $paperPath.AddBezier(212, 371, 178, 354, 147, 342, 118, 346)
  $paperPath.CloseFigure()
  $Graphics.FillPath([System.Drawing.SolidBrush]::new($paper), $paperPath)

  $band = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $band.AddBezier(118, 346, 147, 342, 178, 354, 212, 371)
  $band.AddBezier(212, 371, 271, 400, 345, 398, 398, 362)
  $band.AddLine(398, 362, 398, 400)
  $band.AddBezier(398, 400, 336, 441, 265, 429, 203, 410)
  $band.AddBezier(203, 410, 172, 395, 144, 383, 118, 388)
  $band.CloseFigure()
  $Graphics.FillPath([System.Drawing.SolidBrush]::new($selection), $band)

  $route = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $route.AddBezier(148, 344, 193, 294, 207, 225, 256, 202)
  $route.AddBezier(256, 202, 293, 185, 313, 219, 327, 246)
  $route.AddBezier(327, 246, 345, 281, 366, 294, 395, 268)
  $routePen = [System.Drawing.Pen]::new($teal, 24)
  $routePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $routePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $routePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $Graphics.DrawPath($routePen, $route)

  $Graphics.FillEllipse([System.Drawing.SolidBrush]::new($ochre), 348, 212, 96, 96)
  $Graphics.FillEllipse([System.Drawing.SolidBrush]::new($paper), 379, 243, 34, 34)

  $star = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $starPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(256,202), [System.Drawing.PointF]::new(274,238), [System.Drawing.PointF]::new(314,244), [System.Drawing.PointF]::new(285,273), [System.Drawing.PointF]::new(292,313),
    [System.Drawing.PointF]::new(256,294), [System.Drawing.PointF]::new(220,313), [System.Drawing.PointF]::new(227,273), [System.Drawing.PointF]::new(198,244), [System.Drawing.PointF]::new(238,238)
  )
  $star.AddPolygon($starPoints)
  $Graphics.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(41, 23, 42, 51)), $star)

  $shadow = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $shadow.AddBezier(150, 388, 173, 386, 194, 395, 217, 406)
  $shadow.AddBezier(217, 406, 275, 435, 344, 433, 398, 398)
  $shadowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(46, 23, 42, 51), 8)
  $shadowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $shadowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $Graphics.DrawPath($shadowPen, $shadow)
  $Graphics.Restore($state)
}

function Save-Icon {
  param([int]$Size, [string]$Name)
  $bmp = [System.Drawing.Bitmap]::new($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  Draw-Icon -Graphics $g -Scale ($Size / 512.0)
  $bmp.Save((Join-Path $icons $Name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

Save-Icon 192 'icon-192.png'
Save-Icon 512 'icon-512.png'
Save-Icon 512 'icon-maskable-512.png'
Save-Icon 180 'apple-touch-icon.png'

$qa = [System.Drawing.Bitmap]::new(192, 96)
$g = [System.Drawing.Graphics]::FromImage($qa)
$g.Clear([System.Drawing.ColorTranslator]::FromHtml('#F5F0E6'))
$g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#172A33')), 96, 0, 96, 96)
$small = [System.Drawing.Bitmap]::new(48, 48)
$smallGraphics = [System.Drawing.Graphics]::FromImage($small)
Draw-Icon -Graphics $smallGraphics -Scale (48 / 512.0)
$g.DrawImage($small, 24, 24, 48, 48)
$g.DrawImage($small, 120, 24, 48, 48)
$qa.Save((Join-Path $PSScriptRoot 'icon-48-light-dark.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$smallGraphics.Dispose(); $small.Dispose()
$g.Dispose(); $qa.Dispose()
