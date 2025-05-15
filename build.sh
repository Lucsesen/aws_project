ECR_REGISTRY="018993003597.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t aws_stockmaster .
docker tag aws_stockmaster:latest $ECR_REGISTRY/aws_stockmaster:latest
docker push $ECR_REGISTRY/aws_stockmaster:latest