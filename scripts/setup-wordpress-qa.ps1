param([string]$QaRoot = (Join-Path $PSScriptRoot '../.test-artifacts/wordpress-qa'))
$ErrorActionPreference = 'Stop'
$QaRoot = [IO.Path]::GetFullPath($QaRoot)
New-Item -ItemType Directory -Force -Path $QaRoot | Out-Null
$packages = @(
  @{Name='wordpress';Url='https://wordpress.org/wordpress-6.8.3.zip';Hash='A163FE8D0D3D89CE00139CA0E0618E109BB7441FAE2F733CFF6C72FC4D170FB9'},
  @{Name='woocommerce';Url='https://downloads.wordpress.org/plugin/woocommerce.10.2.2.zip';Hash='145BF0A38ED610B6202E9A4C8350D31EC0CFC24DAAE9E527C125A9CBC06763C0'},
  @{Name='sqlite';Url='https://downloads.wordpress.org/plugin/sqlite-database-integration.3.1.0.zip';Hash='E260E3ADA78676F1C0F4E09EB9EBCB9ECCE4D4B85F0C6E5A70FB9A93F5B9847F'}
)
foreach ($package in $packages) {
  $archive=Join-Path $QaRoot ($package.Name+'.zip')
  if (!(Test-Path -LiteralPath $archive)) { Invoke-WebRequest $package.Url -OutFile $archive }
  if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $package.Hash) { throw "Hash divergente: $($package.Name). Não executar o pacote." }
  $destination=if($package.Name -eq 'wordpress'){$QaRoot}else{Join-Path $QaRoot 'wordpress/wp-content/plugins'}
  Expand-Archive -LiteralPath $archive -DestinationPath $destination -Force
}
$env:BOOPAY_QA_ROOT=$QaRoot
node (Join-Path $PSScriptRoot 'prepare-wordpress-qa.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Falha ao preparar ambiente WordPress.' }
Write-Output "QA local pronta em $QaRoot. Execute npm run package:plugin e npm run qa:wordpress."
