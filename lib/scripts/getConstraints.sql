select
	[CONSTRAINT_NAME],
	[CONSTRAINT_TYPE]
from information_schema.table_constraints tc
join sys.objects obj on tc.CONSTRAINT_NAME = obj.name
where TABLE_NAME = @tableName and TABLE_SCHEMA = @tableSchema
order by obj.create_date
