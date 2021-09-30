import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class FileStorage{

    constructor(
        private readonly s3 = new XAWS.S3({
            signatureVersion: 'v4'}),
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) { }

        async getUploadUrl(todoId: string): Promise<string> {
            console.log(`Generating upload URL`)
            return this.s3.getSignedUrl('putObject', {
              Bucket: this.bucketName,
              Key: todoId,
              Expires: this.urlExpiration
            })
            
          }
}