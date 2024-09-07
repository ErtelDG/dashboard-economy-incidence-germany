# Get the current Unix time
$timestamp = [int]((Get-Date).ToUniversalTime() - [datetime]"1970-01-01T00:00:00Z").TotalSeconds

# Add all changes to git
git add .

# Commit with the current Unix time as the message
git commit -m "$($timestamp)"

# Push the changes to the remote repository
git push

# Output success message
Write-Output "Pushed to repository with commit message: $timestamp"