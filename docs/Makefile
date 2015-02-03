
all:
	middleman build
	s3cmd put  --add-header='Cache-Control: public, max-age=43200' --recursive ./build/* s3://www.scenevr.com/

