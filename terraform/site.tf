data "aws_s3_bucket" "site_bucket" {
  bucket = "${local.s3_bucket}"
}

resource "null_resource" "build_site" {
  triggers {
    created = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = "cd ../ & npm run build & cd terraform"
  }
}

resource "null_resource" "upload_files" {
  triggers {
    created = "${timestamp()}"
  }

  depends_on = [
    "null_resource.build_site",
  ]

  provisioner "local-exec" {
    command = "aws s3 sync ../build s3://${local.s3_bucket}/${local.site_path}/ --acl public-read"
  }
}

resource "null_resource" "clear_cache" {
  triggers {
    created = "${timestamp()}"
  }

  depends_on = [
    "aws_cloudfront_distribution.site",
    "null_resource.upload_files",
  ]

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.site.id} --paths /*"
  }
}

resource "aws_cloudfront_distribution" "site" {
  enabled = true

  origin {
    domain_name = "${data.aws_s3_bucket.site_bucket.bucket_domain_name}"
    origin_id   = "s3_origin"
    origin_path = "/${local.site_path}"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3_origin"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_root_object = "index.html"

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
}
