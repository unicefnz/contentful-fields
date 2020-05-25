PROJECT_ROOT=$(pwd)

# Iterate through each package
for PACKAGE_DIR in packages/*/; do
  PACKAGE=$(basename $PACKAGE_DIR)
  cd "$PROJECT_ROOT/$PACKAGE_DIR"

  # Build the app
  npm install
  npm run build

  # Extract the artifacts into a repo-wide dir
  mkdir -p "$PROJECT_ROOT/dist/$PACKAGE"
  mv build/* "$PROJECT_ROOT/dist/$PACKAGE/"
done
