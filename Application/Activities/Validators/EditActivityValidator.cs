using Application.Activities.Commands;
using Application.Activities.DTOs;

namespace Application.Activities.Validators
{
    public class EditActivityValidator : BaseActivityValidator<EditActivity.Command, EditActivityDto>
    {
        public EditActivityValidator() : base(x => x.EditActivityDto)
        {
        }
    }
}
