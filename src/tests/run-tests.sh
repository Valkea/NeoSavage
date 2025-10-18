#!/bin/bash
# Convenience script to run tests in Docker

set -e

IMAGE_NAME="neosavage-test"

echo "🎲 NeoSavage Dice Command Test Runner"
echo "======================================"
echo ""

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH"
    exit 1
fi

# Parse command line arguments
REBUILD=false
INTERACTIVE=false
TEST_TYPE="all"

while [[ $# -gt 0 ]]; do
    case $1 in
        --rebuild)
            REBUILD=true
            shift
            ;;
        --interactive|-i)
            INTERACTIVE=true
            shift
            ;;
        --parser)
            TEST_TYPE="parser"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --rebuild          Rebuild Docker image from scratch"
            echo "  --interactive, -i  Run interactive shell in container"
            echo "  --parser           Run only parser tests (not comprehensive)"
            echo "  --help, -h         Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                 # Run comprehensive tests (uses cache)"
            echo "  $0 --rebuild       # Rebuild and run tests"
            echo "  $0 -i              # Open shell in test container"
            echo "  $0 --parser        # Run original parser tests only"
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Build or rebuild image
if [ "$REBUILD" = true ] || ! docker image inspect $IMAGE_NAME &> /dev/null; then
    echo "🔨 Building Docker image..."
    if [ "$REBUILD" = true ]; then
        echo "   (Rebuilding from scratch, no cache)"
        docker build --no-cache -t $IMAGE_NAME -f Dockerfile .
    else
        docker build -t $IMAGE_NAME -f Dockerfile .
    fi
    echo "✅ Build complete"
    echo ""
fi

# Run tests or interactive shell
if [ "$INTERACTIVE" = true ]; then
    echo "🐚 Starting interactive shell..."
    echo "   Run 'npm run test:all' inside container to test"
    echo ""
    docker run --rm -it --entrypoint /bin/sh $IMAGE_NAME
else
    if [ "$TEST_TYPE" = "parser" ]; then
        echo "🧪 Running parser tests..."
        echo ""
        docker run --rm $IMAGE_NAME npm test
    else
        echo "🧪 Running comprehensive test suite..."
        echo ""
        docker run --rm $IMAGE_NAME npm run test:all
    fi
fi

echo ""
echo "✅ Done!"
