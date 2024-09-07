# Get the current Unix time
$timestamp = [int]((Get-Date).ToUniversalTime() - [datetime]"1970-01-01T00:00:00Z").TotalSeconds

# Add all changes to git
git add .