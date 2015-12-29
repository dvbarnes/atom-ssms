select OBJECT_SCHEMA_NAME(object_id) as [TABLE_SCHEMA], name as [TABLE_NAME], [is_ms_shipped] from sys.objects where type='V'
